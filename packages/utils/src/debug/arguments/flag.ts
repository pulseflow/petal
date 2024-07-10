import { isUndefined } from '../../core';

export const sym_str: unique symbol = Symbol('@flowr/utils/arg:flag:string');
export const sym_int: unique symbol = Symbol('@flowr/utils/arg:flag:integer');
export const sym_bool: unique symbol = Symbol('@flowr/utils/arg:flag:boolean');

export function flag<A extends boolean>(array: A): <T extends FlagType>(type: T) =>
<F extends OuterFlagType<T, A> | undefined>(short?: string, fallback?: F) => OptionFlag<T, A, F> {
	return <T extends FlagType>(type: T) =>
		<F extends OuterFlagType<T, A> | undefined>(short?: string, fallback?: F) => {
			return {
				type,
				array,
				short,
				fallback,
			} as OptionFlag<T, A, F>;
		};
}

export const single = flag(false);
export const bool = single(sym_bool);
export const int = single(sym_int);
export const str = single(sym_str);

export const array = flag(true);
export const bools = array(sym_bool);
export const ints = array(sym_int);
export const strs = array(sym_str);

export class Flag<N extends string, T extends FlagType, A extends boolean, F extends OuterFlagType<T, A> | undefined> {
	constructor(public name: N, public options: OptionFlag<T, A, F>) { }

	is(input: string): boolean { return this.#regex.test(input); }

	upsert(input: string, existing?: OuterFlagType<T, A>): OuterFlagType<T, A>;
	upsert(input: string, existing?: OuterFlagType<T, A>) {
		const value = this.#parse(input);
		return this.options.array ? [...(existing ?? []) as OuterFlagType<T, true>, value] : value;
	}

	match(existing?: OuterFlagType<T, A>): OuterFlagType<T, A> | FallbackFlagType<T, A, true>;

	match(existing?: OuterFlagType<T, A>) {
		if (this.options.type === sym_bool)
			return this.options.array
				? [...(existing ?? []) as OuterFlagType<T, true>, true]
				: true;

		if (!isUndefined(existing))
			return existing;
		if (!isUndefined(this.options.fallback))
			return this.options.fallback;
		if (this.options.array)
			return [];
		return null;
	}

	fallback(): OuterFlagType<T, A> | FallbackFlagType<T, A, false> {
		if (this.options.fallback !== undefined)
			return this.options.fallback;
		if (this.options.array)
			return [] as OuterFlagType<T, true> as FallbackFlagType<T, A, false>;

		if (this.options.type === sym_bool)
			return false as FallbackFlagType<T, A, false>;

		return null as FallbackFlagType<T, A, false>;
	}

	#parse(input: string): InnerFlagType<T> {
		return this.#convert(this.#match(input));
	}

	#match(input: string): string {
		return input.match(this.#regex)![1];
	}

	get #regex(): {
		[sym_int]: RegExp;
		[sym_bool]: RegExp;
		[sym_str]: RegExp;
	}[T] {
		return {
			[sym_int]: /(\d+)/,
			[sym_bool]: /(true|false|1|0)/,
			[sym_str]: /(\S+)/,
		}[this.options.type];
	}

	get #convert(): (x: string) => InnerFlagType<T> {
		return {
			[sym_int]: (x: string) => Number(x),
			[sym_bool]: (x: string) => x === 'true' || x === '1',
			[sym_str]: (x: string) => x,
		}[this.options.type] as (x: string) => InnerFlagType<T>;
	}
}

export type FlagTypeString = typeof sym_str;
export type FlagTypeInteger = typeof sym_int;
export type FlagTypeBool = typeof sym_bool;
export type FlagType = FlagTypeString | FlagTypeInteger | FlagTypeBool;

export type InnerFlagType<T extends FlagType> = T extends FlagTypeBool ? boolean : T extends FlagTypeInteger
	? number : T extends FlagTypeString ? string : never;

export type OuterFlagType<T extends FlagType, A extends boolean> = A extends true ? InnerFlagType<T>[] : InnerFlagType<T>;
export type FallbackFlagType<T extends FlagType, A extends boolean, Matched extends boolean = false> =
	A extends true ? OuterFlagType<T, A> : T extends FlagTypeBool ? Matched : null;

export interface OptionFlag<T extends FlagType, A extends boolean, F extends OuterFlagType<T, A> | undefined> {
	array: A;
	type: T;
	fallback: F;
	short?: string;
}

export type UnknownOptionFlag = OptionFlag<FlagType, boolean, OuterFlagType<FlagType, boolean> | undefined>;

export type Flags<T extends Record<string, UnknownOptionFlag>> = {
	[P in keyof T]: Flag<P & string, T[P]['type'], T[P]['array'], OuterFlagType<T[P]['type'], T[P]['array']> | undefined>;
};

export type ParsedFlags<T extends Record<string, UnknownOptionFlag>> = {
	[P in keyof T]: T[P] extends OptionFlag<infer U, infer A, infer _F> ? OuterFlagType<U, A> | T[P]['fallback'] extends infer G
		? G extends undefined ? FallbackFlagType<U, A> : G : never : never;
};

export type Aliases<T extends Record<string, UnknownOptionFlag>> = {
	[P in keyof T]: T[P]['short'] extends string ? T[P]['short'] : never;
};
