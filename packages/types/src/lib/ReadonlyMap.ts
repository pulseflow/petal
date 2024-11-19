/* eslint-disable ts/no-empty-object-type -- prototype manipulation */
type ReadonlyMapKey = string | number;

export interface ReadonlyMap<Type extends Record<ReadonlyMapKey, unknown>> {
	forEach: (cb: <Key extends keyof Type>(value: Type[Key], key: Key, map: this) => void, thisArg?: unknown) => void;
	get: <Key extends ReadonlyMapKey>(key: Key) => Key extends keyof Type ? Type[Key] : undefined;
	has: <Key extends ReadonlyMapKey>(key: Key) => Key extends keyof Type ? true : false;
	set: <Key extends ReadonlyMapKey, Value>(key: Key, value: Value) => ReadonlyMap<Record<Key, Value> & { [Part in Exclude<keyof Type, Key>]: Type[Part] }>;
	clear: () => ReadonlyMap<{}>;
	delete: <Key extends ReadonlyMapKey>(key: Key) => ReadonlyMap<Omit<Type, Key>>;
	entries: () => IterableIterator<{ [Key in keyof Type]-?: [Key, Type[Key]] }[keyof Type]>;
	keys: () => IterableIterator<keyof Type>;
	values: () => IterableIterator<Type[keyof Type]>;

	[Symbol.iterator]: () => IterableIterator<{ [Key in keyof Type]-?: [Key, Type[Key]] }[keyof Type]>;
	readonly size: number;
	readonly [Symbol.toStringTag]: string;
}

export interface ReadonlyMapConstructor {
	readonly prototype: ReadonlyMap<Record<ReadonlyMapKey, unknown>>;
	new (): ReadonlyMap<{}>;
	new<Key extends ReadonlyMapKey, Value>(entries?: ReadonlyArray<[Key, Value]>): ReadonlyMap<Record<Key, Value>>;
}
