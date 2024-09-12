import type { Awaitable } from '../types';
import type { WithStatus } from './const';
import { isString } from '../core';
import { SYM_STATUS } from './const';

async function statusWrapper<T>(fn: Awaitable<T>, status: number): Promise<WithStatus<T>> {
	const result = await fn;
	Object.defineProperty(result, SYM_STATUS, { value: status });
	return result as WithStatus<T>;
}

export type Finalizer<T> = (res: Response) => Awaitable<T>;
export const toJson = <T = any>(res: Response): Promise<WithStatus<T>> => statusWrapper(res.json<T>(), res.status);
export const toJsonPick = <T, K extends keyof T & string>(res: Response, key: K): Promise<WithStatus<T[K]>> => statusWrapper(res.json<T>().then(it => it[key]), res.status);
export const toText = (res: Response): Promise<string> => res.text();
export const toBlob = (res: Response): Promise<WithStatus<Blob>> => statusWrapper(res.blob(), res.status);
export const toArrayBuffer = (res: Response): Promise<WithStatus<ArrayBuffer>> => statusWrapper(res.arrayBuffer(), res.status);

export interface WrappedResponse extends Response { headers: Headers & Record<string, string> }

export async function toWrapped(res: Response): Promise<WrappedResponse> {
	return new Proxy(res, {
		get(target: Response, prop: keyof WrappedResponse) {
			const value = target[prop];

			if (prop === 'headers') {
				const banned = Object.getOwnPropertyNames(Object.getPrototypeOf(target.headers));
				return new Proxy(target.headers, {
					get: (target: Headers, prop: keyof Headers) => {
						if (!isString(prop) || banned.includes(prop))
							return value;
						else return target.get(prop);
					},
				});
			}
			else { return value; }
		},
	}) as WrappedResponse;
}

export const toDefault = toWrapped;
