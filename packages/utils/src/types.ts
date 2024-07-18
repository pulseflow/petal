import { isFunction, isString } from './core';

/** Possibly a `Promise<T>` */
export type Awaitable<T> = T | PromiseLike<T>;
export type StrictAwaitable<T> = T | Promise<T>;

/** Possibly a `null` */
export type Nullable<T> = T | null | undefined;
export type StrictNullable<T> = T | null;

/** Possibly an `Array<T>` */
export type Arrayable<T> = T | Array<T>;

export type ToString<T> = T extends `${infer V}` ? V : never;

/** Possibly a Function */
export type Fn<Return = void> = () => Return;
export type ArgsFn<Return = any, Args extends any[] = any[]> = (...args: Args) => Return;

export type ClassConstructor<Return = void, Args extends any[] = any[]> = new (...args: Args) => Return;

/** Infers the eleement type of an Array */
export type ElementOf<T> = T extends (infer E)[] ? E : never;

/**
 * Defines an intersection type of all union items.
 *
 * @param U Union of any types that will be intersected.
 * @returns U items intersected
 * @see https://stackoverflow.com/a/50375286/9259330
 */
export type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

/**
 * Infers the arguments type of a function
 */
export type ArgumentsType<T> = T extends ((...args: infer A) => any) ? A : never;

export type MergeInsertions<T> = T extends object ? { [K in keyof T]: MergeInsertions<T[K]> } : T;

export type DeepMerge<F, S> = MergeInsertions<{
	[K in keyof F | keyof S]: K extends keyof S & keyof F
		? DeepMerge<F[K], S[K]> : K extends keyof S ? S[K] : K extends keyof F ? F[K] : never;
}>;

export type Key<T> = T extends ReadonlyMap<infer U> ? keyof U : T extends Record<infer U, any> ? U : never;

export type ExtractKeysByType<T, U> = {
	[K in Extract<keyof T, string>]: T[K] extends U ? K : never;
}[Extract<keyof T, string>];

export type ParametersExceptFirst<F> = F extends (arg0: any, ...rest: infer R) => any ? R : never;

export const identity = <T>(arg: T): T => arg;

class _EmptyClass {}

export function boundMethods<T extends _EmptyClass>(t: T): {
	[K in keyof T & string as T[K] extends ArgsFn ? K : never]: T[K]
} {
	const methods: Record<string, ArgsFn> = {};
	let result = t as any;

	while (result && result !== Object.prototype) {
		const keys = Reflect.ownKeys(result);
		keys.forEach((key) => {
			if (!isString(key))
				return;
			if (!Reflect.has(t, key))
				return;
			if (isFunction((t as any)[key]) && key !== 'constructor')
				methods[key] = (t as any)[key].bind();
		});

		result = Reflect.getPrototypeOf(result);
	}

	return methods as any;
}

export function pick<T extends object, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
	return Object.fromEntries(Object.entries(obj).filter(([k]) => keys.includes(k as K))) as Pick<T, K>;
}

export function omit<T extends object, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> {
	return Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k as K))) as Omit<T, K>;
}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Necessary<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
export type OptionalExcept<T, K extends keyof T> = Partial<Omit<T, K>> & Required<Pick<T, K>>;
export type NecessaryExcept<T, K extends keyof T> = Required<Omit<T, K>> & Partial<Pick<T, K>>;
export type Swap<T, K extends keyof T, V> = Omit<T, K> & Record<K, V>;

export const swap = <T, K extends keyof T, V>(obj: T, key: K, value: V): Swap<T, K, V> => ({ ...obj, [key]: value });

export type PickNecessary<T> = Pick<T, { [K in keyof T]-?: object extends Pick<T, K> ? never : K; }[keyof T]>;
export type PickOptional<T> = Pick<T, { [K in keyof T]-?: object extends Pick<T, K> ? K : never; }[keyof T]>;

export type Rename<T, K extends keyof T, V extends string> = Omit<T, K> & Record<V, T[K]>;

export function rename<T extends Record<string | number | symbol, any>, K extends keyof T, V extends string>(obj: T, from: K, to: V): Rename<T, K, V> {
	return ({ ...omit(obj, from), [to]: obj[from] }) as Rename<T, K, V>;
}

export interface ArrayPosN<T> extends Array<ArrayPosN<T> | T> {}
export type ArrayN<T> = ArrayPosN<T> | T;
export interface ArrayInf<T> extends Array<ArrayInf<T>> {}

export type Dict<T> = Record<string, T>;
export interface DictPosN<T> extends Dict<DictPosN<T> | T> {}
export type DictN<T> = DictPosN<T> | T;
export interface DictInf<T> extends Dict<DictInf<T>> {}

export type LastOf<T> = UnionToIntersection<T extends any ? () => T : never> extends () => infer R ? R : never;
export type Push<T extends any[], V> = [...T, V];

/**
 * @description THIS IS A BAD IDEA. ONLY USE THIS IF YOU KNOW WHAT YOU'RE DOING.
 * @copyright CC BY-SA 4.0 https://stackoverflow.com/a/55128956
 */
export type TuplifyUnion<T, L = LastOf<T>, N = [T] extends [never] ? true : false> = true extends N ? [] : Push<TuplifyUnion<Exclude<T, L>>, L>;

export interface MethodDictInf<T> extends Dict<MethodDictInf<T>> { (): T }

export interface ReadonlyMap<T extends Record<string, any>> {
	forEach: (
		callbackfn: <K extends keyof T>(
			value: T[K], key: K, map: this
		) => void,
		thisArg?: any,
	) => void;

	get: <K extends string>(key: K) => K extends keyof T ? T[K] : undefined;
	has: <K extends string>(key: K) => K extends keyof T ? true : false;
	set: <K extends string, V>(key: K, value: V) => ReadonlyMap< & { [P in K]: V } & { [P in Exclude<keyof T, K>]: T[P] }>;

	clear: () => ReadonlyMap<Record<string, never>>;
	keys: () => IterableIterator<keyof T>;
	values: () => IterableIterator<T[keyof T]>;
	entries: () => IterableIterator<{ [K in keyof T]-?: [K, T[K]] }[keyof T]>;

	readonly size: number;
	readonly [Symbol.toStringTag]: string;

	[Symbol.iterator]: () => IterableIterator<{ [K in keyof T]-?: [K, T[K]] }[keyof T]>;
}

export interface ReadonlyMapConstructor {
	readonly prototype: ReadonlyMap<Record<string, any>>;

	new(): ReadonlyMap<Record<string, never>>;
	new<K extends string, V>(
		entries?: ReadonlyArray<[K, V]>,
	): ReadonlyMap<{ [P in K]: V }>;
}

export const M = Map as any as ReadonlyMapConstructor;
