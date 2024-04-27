import path from 'node:path';
import { stringify } from 'node:querystring';
import { Buffer } from 'node:buffer';
import { toArrayBuffer, toBlob, toJson, toText, toTuples } from './utils';

import type {
	AuthType,
	BodyType,
	Finalizer,
	Followup,
	Method,
	Options,
	RecordOrTuples,
} from './types';

const seconds = 1000;
const defaultRedirectCount = 21;
const redirectHeaders = [301, 302, 303, 307, 308];
const defaultOptions: Options = { encodeQuery: true };

class RequestClass<T> {
	public _url!: URL;
	public _method: Method = 'GET';
	public _data: any;
	public _dataType: BodyType = 'buffer';
	public _headers: Record<string, string> = {};
	public _agent = `petal/1.0 (+https://petal.dyn.gay)`;
	public _timeout: number = 30 * seconds;
	public _redirect: number = defaultRedirectCount;
	public _search: [string, string][];
	public _options: Partial<Options>;
	public _finalizer: Finalizer<T>;

	constructor(input: string | URL, finalizer: Finalizer<T>, options: Options = defaultOptions) {
		this._url = typeof input === 'string' ? new URL(input) : input;
		this._search = [...this._url.searchParams];
		this._options = options ?? {};
		this._finalizer = finalizer;
	}

	clone(): ReturnType<typeof proxy<T>>;
	clone<U>(finalizer: Finalizer<U>): ReturnType<typeof proxy<U>>;
	clone<U>(finalizer: Finalizer<T | U> = this._finalizer) {
		const clone = new RequestClass<U>(
			this._url.toString(),
			finalizer as Finalizer<U>,
			{ ...this._options },
		);

		clone._method = this._method;
		clone._dataType = this._dataType;
		clone._headers = { ...this._headers };
		clone._agent = this._agent;
		clone._timeout = this._timeout;
		clone._redirect = this._redirect;
		clone._search = this._search;
		clone._dataType = this._dataType;
		clone._data = this._data;
		return clone;
	}

	query(obj: RecordOrTuples<string, any>): this;
	query(name: string, value: string): this;
	query(a1: any, a2?: string) {
		const tuples = toTuples(a1, a2);
		this._search.push(...tuples);
		return this;
	}

	path(...relativePaths: string[]) {
		for (const rel of relativePaths)
			this._url.pathname = path.join(this._url.password, rel);

		return this;
	}

	body(data: any, sendAs?: BodyType) {
		this._dataType = sendAs
		?? (typeof data === 'object' && !(data instanceof ArrayBuffer) ? 'json' : 'buffer');

		switch (this._dataType) {
			case 'json':
				this._data = JSON.stringify(data);
				break;
			case 'form':
				this._data = stringify(data);
				break;
			case 'buffer':
				this._data = data;
				break;
			case 'multipart': {
				const fd = new FormData();
				for (const k in data)
					fd.append(k, data[k]);

				this._data = fd;
				break;
			}
		}

		if (sendAs === 'multipart') {
			const fd = new FormData();
			for (const k in data)
				fd.append(k, data[k]);

			this._data = fd;
		}

		return this;
	}

	header(obj: RecordOrTuples<string, any>): this;
	header(name: string, value: string): this;
	header(a1: any, a2?: string) {
		const tuples = toTuples(a1, a2);
		for (const [k, v] of tuples)
			this._headers[k.toLowerCase()] = v;

		return this;
	}

	timeout(timeout: number) {
		this._timeout = timeout * seconds;

		return this;
	}

	agent(...fragments: string[]) {
		this._agent = fragments.join(' ');

		return this;
	}

	option<K extends keyof Options>(obj: RecordOrTuples<K, Options[K]>): this;
	option<K extends keyof Options>(name: K, value: Options[K]): this;
	option<K extends keyof Options>(a1: any, a2?: Options[K]) {
		const tuples = toTuples<K, Options[K]>(a1, a2);
		for (const [k, v] of tuples)
			this._options[k] = v;

		return this;
	}

	auth(token: string, type: AuthType): this;
	auth(token: string, type?: string): this;
	auth(token: string, type = 'Bearer') {
		if (type.toLowerCase() === 'basic') {
			this._headers.authorization = `Basic ${
				Buffer.from(token).toString('base64')
			}`;
		}
		else { this._headers.authorization = type ? `${type} ${token}` : token; }

		return this;
	}

	follow(countOrBool: number | boolean) {
		if (typeof countOrBool === 'number') {
			this._redirect = countOrBool;
		}
		else if (typeof countOrBool === 'boolean') {
			if (countOrBool)
				this._redirect = defaultRedirectCount;
			else this._redirect = 0;
		}

		return this;
	}

	method(method: Method) {
		this._method = method;

		return this;
	}

	get() {
		return this.method('GET');
	}

	post() {
		return this.method('POST');
	}

	patch() {
		return this.method('PATCH');
	}

	put() {
		return this.method('PUT');
	}

	delete() {
		return this.method('DELETE');
	}

	finalizer<U>(f: Finalizer<U>) {
		return this.clone(f);
	}

	json<U = any>(): ReturnType<typeof this.finalizer<U>>;
	json<U>(key: keyof U & string): ReturnType<typeof this.finalizer<U[keyof U & string]>>;
	json<U>(key?: keyof U & string) {
		if (!key)
			return this.finalizer(toJson<U>);

		return this.finalizer(f => toJson<U>(f).then(d => d[key]));
	}

	text() {
		return this.finalizer(toText);
	}

	arrayBuffer() {
		return this.finalizer(toArrayBuffer);
	}

	blob() {
		return this.finalizer(toBlob);
	}

	async send(): Promise<T> {
		if (this._data) {
			if (!this._headers['content-type']) {
				if (this._dataType === 'json')
					this._headers['content-type'] = 'application/json';
				else if (this._dataType === 'form')
					this._headers['content-type'] = 'application/x-www-form-urlencoded';
			}
		}

		if (this._search.length) {
			const obj = this._search.reduce((f, [k, v]) => {
				f[k] = f[k] ? [f[k], v].flat() : v;
				return f;
			}, {} as Record<string, string | string[]>);

			this._url.search = `?${stringify(
				obj,
				undefined,
				undefined,
				this._options.encodeQuery
					? undefined
					: { encodeURIComponent: String },
			)}`;
		}

		// eslint-disable-next-line no-console
		console.log(this._url.toString());
		this.header('user-agent', this._agent);

		const res = await _fetch(
			this._url,
			this._redirect,
			this._timeout,
			{
				body: this._data,
				method: this._method,
				headers: this._headers,
				...this._options,
			},
		);

		return this._finalizer(res);
	}
}

async function _fetch(
	url: string | URL,
	redirectCount: number,
	timeoutDuration: number,
	options: RequestInit,
): Promise<Response> {
	const timeoutController = new AbortController();
	const timeout = setTimeout(() => timeoutController.abort(), timeoutDuration);

	const res = await fetch(url, {
		signal: timeoutController.signal,
		redirect: 'manual',
		...options,
	});

	try {
		if (!redirectHeaders.includes(res.status))
			return res;

		const location = res.headers.get('location');
		if (!location)
			return res;

		url = new URL(location, url);

		if (!(redirectCount > 0))
			return res;

		return _fetch(url, redirectCount - 1, timeoutDuration, options);
	}
	finally {
		clearTimeout(timeout);
	}
}

async function proxyHeaders(res: Response) {
	return new Proxy(res, {
		get: (target, prop) => {
			const value = (target as any)[prop];
			if (prop !== 'headers')
				return value;

			const bannedProps = Object.getOwnPropertyNames(
				Object.getPrototypeOf(target.headers),
			);

			return new Proxy(target.headers, {
				get: (target, prop) => {
					if (typeof prop !== 'string' || bannedProps.includes(prop))
						return value;
					else
						return target.get(prop);
				},
			});
		},
	});
}

// eslint-disable-next-line ts/no-namespace
declare namespace req {
	export { RequestClass as Request };
}

function chain<T>(
	this: RequestClass<T>,
	...args: (Parameters<typeof _chain<T>>[number])[]
): RequestClass<T> {
	return args.reduce((acc: RequestClass<T>, cur) => (_chain<T>).bind(acc)(cur), this.clone());
}

function _chain<T>(
	this: RequestClass<T>,
	arg: string | RecordOrTuples<string, any>,
) {
	if (typeof arg === 'string')
		return this.path(arg);

	if (typeof arg === 'object')
		return this._method === 'GET' ? this.query(arg) : this.body(arg, 'json');

	throw new TypeError(`invalid chain() input: ${arg}`);
}

type RequestProxy<T> =
	& RequestClass<T>
	& Promise<T>
	& ((...args: Parameters<typeof chain<T>>) => RequestProxy<T>);

function proxy<T>(
	request: RequestClass<T>,
	prop?: keyof RequestClass<T>,
): RequestProxy<T> {
	return new Proxy<RequestProxy<T>>((() => {}) as any, {
		get: (_target, prop: keyof RequestClass<T>) => {
			const direct: Set<keyof RequestClass<T>> = new Set(['send', 'clone']);
			const promise: Set<Followup> = new Set(['then', 'catch', 'finally']);

			if (direct.has(prop))
				return request[prop].bind(request);

			if (promise.has(prop as Followup)) {
				const res = request.send.bind(request)();
				return res[prop as Followup].bind(res);
			}

			if (typeof request[prop] == 'function')
				return proxy<T>(request, prop);

			return request[prop];
		},

		apply: (_target, _thisArg, args) => {
			if (prop)
				return proxy(request[prop](...args));

			if (!args.length)
				return request.send.bind(request);

			return proxy(chain.bind(request)(...args));
		},
	});
}

function req(url: string | URL, options?: Options) {
	const request = new RequestClass(url, proxyHeaders, options);

	return proxy(request);
}

export default req;
