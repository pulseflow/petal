import { isFunction, isNull, isObject, isString } from '../core';
import { METHODS_SUPPORTED } from './const';
import type { RecordOrTuples } from './arguments';
import type { Method } from './const';
import type { RequestBuilder } from './request';

export function chain<T>(this: RequestBuilder<T>, ...args: (Parameters<typeof _chain<T>>[number])[]): RequestBuilder<T> {
	return args.reduce((acc: RequestBuilder<T>, cur) => (_chain<T>).bind(acc)(cur), this.clone());
}

function _chain<T>(this: RequestBuilder<T>, arg: Method | string | RecordOrTuples<string, any> | null) {
	if (isNull(arg))
		return this;

	if (isString(arg)) {
		if (METHODS_SUPPORTED.includes(arg.toUpperCase() as Method))
			return this.method(arg as Method);

		return this.path(arg);
	}

	if (isObject(arg))
		return this._method === 'GET' ? this.query(arg) : this.body(arg, 'json');

	throw new TypeError(`invalid chain input: ${arg}`);
}

export type RequestProxy<T> =
	& RequestBuilder<T>
	& Promise<T>
	& ((...args: Parameters<typeof chain<T>>) => RequestProxy<T>);

export function proxy<T>(request: RequestBuilder<T>, prop?: keyof RequestBuilder<T>): RequestProxy<T> {
	type Followup = 'then' | 'catch' | 'finally';

	return new Proxy<RequestProxy<T>>((() => {}) as any, {
		get(_target, prop: keyof RequestBuilder<T>) {
			const direct: Set<keyof RequestBuilder<T>> = new Set(['send', 'clone']);
			const promise: Set<Followup> = new Set(['then', 'catch', 'finally']);

			if (direct.has(prop))
				return request[prop].bind(request);

			if (promise.has(prop as Followup)) {
				const res = request.send.bind(request)();
				return res[prop as Followup].bind(res);
			}

			if (isFunction(request[prop]))
				return proxy<T>(request, prop);

			return request[prop];
		},

		apply(_target, _thisArg, args) {
			if (prop)
				return proxy(request[prop](...args));

			if (!args.length)
				return request.send.bind(request);

			return proxy(chain.bind(request)(...args));
		},
	});
}
