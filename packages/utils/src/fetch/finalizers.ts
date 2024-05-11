import { isString } from '../core';
import type { Awaitable } from '../types';
import { SYM_STATUS } from './const';
import type { WithStatus } from './const';

async function statusWrapper<T>(fn: Awaitable<T>, status: number) {
	const result = await fn;
	Object.defineProperty(result, SYM_STATUS, { value: status });
	return result as WithStatus<T>;
}

export type Finalizer<T> = (res: Response) => Awaitable<T>;

export function toJson<T = any>(res: Response) {
	return statusWrapper(res.json<T>(), res.status);
}
export function toJsonPick<T, K extends keyof T & string>(res: Response, key: K) {
	return statusWrapper(res.json<T>().then(it => it[key]), res.status);
}

export const toText = (res: Response) => res.text();
export const toBlob = (res: Response) => statusWrapper(res.blob(), res.status);
export const toArrayBuffer = (res: Response) => statusWrapper(res.arrayBuffer(), res.status);

export interface WrappedResponse extends Response {
	headers: Headers & Record<string, string>;
}

export async function toWrapped(res: Response) {
	return new Proxy(res, {
		get(target: Response, prop: keyof WrappedResponse) {
			const value = target[prop];

			if (prop === 'headers') {
				const banned = Object.getOwnPropertyNames(Object.getPrototypeOf(target.headers));
				return new Proxy(target.headers, {
					get(target: Headers, prop: keyof Headers) {
						if (!isString(prop) || banned.includes(prop))
							return value;
						else
							return target.get(prop);
					},
				});
			}
			else {
				return value;
			}
		},
	}) as WrappedResponse;
}

export const toDefault = toWrapped;
