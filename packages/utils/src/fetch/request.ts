import { Buffer } from 'node:buffer';
import { join } from 'pathe';
import { version } from '../../package.json';
import { isString } from '../core';
import { toTuples } from './arguments';
import { DEF_REFDIR_COUNT, DEF_TIMEOUT } from './const';
import { fetchWrapper } from './fetch';
import * as fin from './finalizers';
import type { RecordOrTuples } from './arguments';
import type { RequestProxy } from './chaining';
import type { Method, WithStatus } from './const';
import type { Finalizer } from './finalizers';

export type Options = RequestInit & { encodeQuery?: boolean };
export type BodyType = 'json' | 'buffer' | 'form' | 'multipart';
export type AuthType = 'Bearer' | 'Basic';

const defaultOptions: Options = { encodeQuery: true };

export class RequestBuilder<T> {
	public _url!: URL;
	public _method: Method = 'GET';
	public _data: any;
	public _dataType: BodyType = 'buffer';
	public _headers: Record<string, string> = {};
	public _agent: string = `@flowr/utils/fetch/${version} (+https://github.com/pulseflow)`;
	public _timeout: number = DEF_TIMEOUT;
	public _redirect: number = DEF_REFDIR_COUNT;
	public _search: [string, string][];
	public _options: Partial<Options>;
	public _finalizer: Finalizer<T>;

	constructor(
		input: string | URL,
		finalizer: Finalizer<T>,
		options: Options = defaultOptions,
	) {
		this._url = isString(input) ? new URL(input) : input;
		this._search = [...this._url.searchParams];
		this._options = options ?? {};
		this._finalizer = finalizer;
	}

	/**
	 * Clone the current {@link RequestProxy<T>}.
	 *
	 * @see {@link RequestProxy<T>}
	 * @chainable
	 */
	clone(): RequestProxy<T>;
	clone<U>(finalizer: Finalizer<U>): RequestProxy<U>;
	clone<U>(finalizer: Finalizer<T | U> = this._finalizer): RequestProxy<T> | RequestProxy<U> {
		const clone = new RequestBuilder<U>(
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
		clone._search = [...this._search];
		clone._dataType = this._dataType;
		clone._data = this._data;
		return clone as RequestProxy<T> | RequestProxy<U>;
	}

	/**
	 * Push an object(s) to the query string/search object.
	 *
	 * @chainable
	 */
	query(obj: RecordOrTuples<string, any>): this;
	query(name: string, value: string): this;
	query(a1: any, a2?: string): this {
		const tuples = toTuples(a1, a2);
		this._search.push(...tuples);
		return this;
	}

	/**
	 * Append an array of relative paths to the base pathname of the current URL.
	 *
	 * @see {@link URL}
	 * @chainable
	 */
	path(...relativePaths: string[]): this {
		for (const relativePath of relativePaths) this._url.pathname = join(this._url.pathname, relativePath);
		return this;
	}

	/**
	 * Set the body data, as a {@link BodyType}
	 *
	 * @see {@link BodyType}
	 * @chainable
	 */
	body(data: any, sendAs?: BodyType): this {
		this._dataType = sendAs ?? (typeof data === 'object' && !(data instanceof ArrayBuffer) ? 'json' : 'buffer');

		switch (this._dataType) {
			case 'json':
				this._data = JSON.stringify(data);
				break;
			case 'form':
				this._data = new URLSearchParams(data);
				break;
			case 'multipart': {
				const fd = new FormData();
				for (const key in data) fd.append(key, data[key]);
				this._data = fd;
				break;
			}
			case 'buffer':
				this._data = data;
				break;
		}

		if (sendAs === 'multipart') {
			const fd = new FormData();
			for (const key in data) fd.append(key, data[key]);
			this._data = fd;
		}

		return this;
	}

	/**
	 * Push an object(s) to the current header record.
	 *
	 * @see {@link Record<string, string>}
	 * @chainable
	 */
	header(obj: RecordOrTuples<string, any>): this;
	header(name: string, value: string): this;
	header(a1: any, a2?: string): this {
		const tuples = toTuples(a1, a2);
		for (const [key, value] of tuples) this._headers[key.toLowerCase()] = value;
		return this;
	}

	/**
	 * Set the timeout in milliseconds of this request.
	 *
	 * @chainable
	 */
	timeout(timeout: number): this {
		this._timeout = timeout;
		return this;
	}

	/**
	 * Set the `User-Agent` header of this request.
	 *
	 * @chainable
	 */
	agent(...fragments: string[]): this {
		this._agent = fragments.join(' ');
		return this;
	}

	option<K extends keyof Options>(obj: RecordOrTuples<K, Options[K]>): this;
	option<K extends keyof Options>(name: K, value: Options[K]): this;
	option<K extends keyof Options>(a1: any, a2?: Options[K]): this {
		const tuples = toTuples<K, Options[K]>(a1, a2);
		for (const [key, value] of tuples) this._options[key] = value;
		return this;
	}

	auth(token: string, type: AuthType): this;
	auth(token: string, type?: string): this;
	auth(token: string, type = 'Bearer'): this {
		if (type.toLowerCase() === 'basic')
			this._headers.authorization = `Basic ${Buffer.from(token).toString('base64')}`;
		else this._headers.authorization = type ? `${type} ${token}` : token;
		return this;
	}

	follow(countOrBool: number | boolean): this {
		if (typeof countOrBool === 'number')
			this._redirect = countOrBool;
		else if (typeof countOrBool === 'boolean')
			if (countOrBool)
				this._redirect = DEF_REFDIR_COUNT;
			else
				this._redirect = 0;
		return this;
	}

	method(method: Method): this {
		this._method = method;
		return this;
	}

	get(): this {
		return this.method('GET');
	}

	post(): this {
		return this.method('POST');
	}

	patch(): this {
		return this.method('PATCH');
	}

	put(): this {
		return this.method('PUT');
	}

	delete(): this {
		return this.method('DELETE');
	}

	finalizer<U>(fn: Finalizer<U>): RequestProxy<U> {
		return this.clone(fn);
	}

	json<U = any>(): RequestProxy<WithStatus<U>>;
	json<U, K extends keyof U & string>(key: keyof U & string): RequestProxy<WithStatus<U[K]>>;
	json<U, K extends keyof U & string>(key?: K): RequestProxy<WithStatus<U>> | RequestProxy<WithStatus<U[K]>> {
		if (key)
			return this.finalizer(res => fin.toJsonPick<U, K>(res, key));
		return this.finalizer(fin.toJson<U>);
	}

	text(): RequestProxy<string> {
		return this.finalizer(fin.toText);
	}

	arrayBuffer(): RequestProxy<WithStatus<ArrayBuffer>> {
		return this.finalizer(fin.toArrayBuffer);
	}

	blob(): RequestProxy<WithStatus<Blob>> {
		return this.finalizer(fin.toBlob);
	}

	async send(): Promise<T> {
		if (this._data)
			if (!this._headers['content-type'])
				if (this._dataType === 'json')
					this._headers['content-type'] = 'application/json';
				else if (this._dataType === 'form')
					this._headers['content-type'] = 'application/x-www-form-urlencoded';

		if (this._search.length) {
			const query = this._options.encodeQuery
				? new URLSearchParams(this._search)
				: this._search.map(([k, v]) => `${k}=${v}`).join('&');

			this._url.search = `?${query}`;
		}

		this.header('user-agent', this._agent);

		const res = await fetchWrapper(
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
