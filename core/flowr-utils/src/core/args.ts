/**
 * export const str = Symbol('petal:arg:flag:string');
export const int = Symbol('petal:arg:flag:integer');
export const bool = Symbol('petal:arg:flag:boolean');
const none = Symbol('petal:arg:match:none');

type FlagType = typeof str | typeof int | typeof bool;

type ResolvedFlagType<T extends FlagType> =
	T extends typeof bool ? boolean
		: T extends typeof int ? number
			: string;

export interface FlagOptions<T extends FlagType> {
	type: T;
	fallback?: ResolvedFlagType<T>;
	short?: string;
}

type InputFlags = Record<string, FlagOptions<FlagType>>;

type Flags<T extends InputFlags> = {
	[P in keyof T]: Flag<P & string, T[P]['type']>;
};

type ParsedFlags<T extends InputFlags> = {
	[P in keyof T]: ResolvedFlagType<T[P]['type']>[];
};

type Aliases<T extends InputFlags> = {
	[P in keyof T]: T[P]['short'] extends string ? T[P]['short'] : never;
};

class Flag<K extends string, T extends FlagType> {
	constructor(public name: K, public options: FlagOptions<T>) {}

	get regex() {
		return {
			[int]: /(\d+)/,
			[bool]: /(true|false|1|0)/,
			[str]: /(\S+)/,
		}[this.options.type];
	}

	get convert() {
		return {
			[int]: (x: string) => Number(x),
			[bool]: (x: string) => x === 'true' || x === '1',
			[str]: (x: string) => x,
		}[this.options.type] as (x: string) => ResolvedFlagType<T>;
	}
}

 */
