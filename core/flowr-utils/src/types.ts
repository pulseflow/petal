/* eslint-disable ts/ban-types */

export type Key<T> = T extends ReadonlyMap<infer U> ? keyof U
	: T extends Record<infer U, any> ? U
		: never;

export type FunctionVoid = (...args: any[]) => void;

export type ExtractKeysByType<T, U> = {
	[K in Extract<keyof T, string>]: T[K] extends U ? K : never;
}[Extract<keyof T, string>];

export type ParametersExceptFirst<F> =
	F extends (arg0: any, ...rest: infer R) => any ? R : never;

export const identity = <T>(arg: T): T => arg;

export function pick<T extends object, K extends keyof T>(obj: T, ...keys: K[]) {
	return Object.fromEntries(
		Object.entries(obj).filter(([k]) => keys.includes(k as K)),
	) as Pick<T, K>;
}

export function omit<T extends object, K extends keyof T>(obj: T, ...keys: K[]) {
	return Object.fromEntries(
		Object.entries(obj).filter(([k]) => !keys.includes(k as K)),
	) as Omit<T, K>;
}

export type Optional<T, K extends keyof T> =
	& Omit<T, K>
	& Partial<Pick<T, K>>;

export type Necessary<T, K extends keyof T> =
	& Omit<T, K>
	& Required<Pick<T, K>>;

export type OptionalExcept<T, K extends keyof T> =
	& Partial<Omit<T, K>>
	& Required<Pick<T, K>>;
export type NecessaryExcept<T, K extends keyof T> =
	& Required<Omit<T, K>>
	& Partial<Pick<T, K>>;

export type Swap<T, K extends keyof T, V> =
	& Omit<T, K>
	& Record<K, V>;

export function swap<T, K extends keyof T, V>(obj: T, key: K, value: V): Swap<T, K, V> {
	return { ...obj, [key]: value };
}

export type PickNecessary<T> = Pick<T, {
	[K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T]>;

export type PickOptional<T> = Pick<T, {
	[K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T]>;

export type Rename<T, K extends keyof T, V extends string> =
	& Omit<T, K>
	& Record<V, T[K]>;

export function rename<T extends Record<string | number | symbol, any>, K extends keyof T, V extends string>(obj: T, from: K, to: V): Rename<T, K, V> {
	return ({ ...omit(obj, from), [to]: obj[from] }) as Rename<T, K, V>;
}

/**
 * A type representing all allowed JSON primitive values.
 *
 * @public
 */
export type JsonPrimitive = number | string | boolean | null;

/**
 * A type representing all allowed JSON object values.
 *
 * @public
 */
export type JsonObject = { [key in string]?: JsonValue };

/**
 * A type representing all allowed JSON array values.
 *
 * @public
 */
export interface JsonArray extends Array<JsonValue> {}

/**
 * A type representing all allowed JSON values.
 *
 * @public
 */
export type JsonValue = JsonObject | JsonArray | JsonPrimitive | unknown;

export interface ArrayPosN<T> extends Array<ArrayPosN<T> | T> {}
export type ArrayN<T> = ArrayPosN<T> | T;
export interface ArrayInf<T> extends Array<ArrayInf<T>> {}

export type Dict<T> = Record<string, T>;
export interface DictPosN<T> extends Dict<DictPosN<T> | T> {}
export type DictN<T> = DictPosN<T> | T;
export interface DictInf<T> extends Dict<DictInf<T>> {}

export interface MethodDictInf<T> extends Dict<MethodDictInf<T>> {
	(): T;
}

export interface ReadonlyMap<T extends Record<string, any>> {
	forEach: (
		callbackfn: <K extends keyof T>(
			value: T[K], key: K, map: this
		) => void,
		thisArg?: any,
	) => void;

	get<K extends string>(key: K): K extends keyof T ? T[K] : undefined;
	has<K extends string>(key: K): K extends keyof T ? true : false;
	set<K extends string, V>(key: K, value: V): ReadonlyMap< & { [P in K]: V } & { [P in Exclude<keyof T, K> ]: T[P] }>;

	clear(): ReadonlyMap<{}>;
	keys(): IterableIterator<keyof T>;
	values(): IterableIterator<T[keyof T]>;
	entries(): IterableIterator<{ [K in keyof T]-?: [K, T[K]] }[keyof T]>;

	readonly size: number;
	readonly [Symbol.toStringTag]: string;

	[Symbol.iterator](): IterableIterator<{ [K in keyof T]-?: [K, T[K]] }[keyof T]>;
}

export interface ReadonlyMapConstructor {
	readonly prototype: ReadonlyMap<Record<string, any>>;

	new(): ReadonlyMap<{}>;
	new<K extends string, V>(
		entries?: ReadonlyArray<[K, V]>,
	): ReadonlyMap<{ [P in K]: V }>;
}

export const M = Map as any as ReadonlyMapConstructor;
