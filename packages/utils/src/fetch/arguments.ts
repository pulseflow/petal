import { toString } from '../core';

type Tuples<K extends PropertyKey, V> = [K, V][];
export type RecordOrTuples<K extends string, V> =
	| Partial<Record<K, V>>
	| Tuples<K, V>
	| Map<K, V>;

export function toTuples<K extends string, V>(t: RecordOrTuples<K, V> | string, v?: V): Tuples<K, V> {
	if (t instanceof Map)
		return [...t];
	if (Array.isArray(t))
		return t;
	if (toString(t) === '[object Object]')
		return Object.entries(t) as Tuples<K, V>;
	if (typeof t === 'string' && typeof v === 'string')
		return [[t as K, v]];
	throw new TypeError(`invalid toTuples input: ${t}`);
}
