import { isObject, isString } from '../core';

type Key = string | number | symbol;
type Tuples<K extends Key, V> = [K, V][];
export type RecordOrTuples<K extends string, V> =
	| Partial<Record<K, V>>
	| Tuples<K, V>
	| Map<K, V>;

export function toTuples<K extends string, V>(t: RecordOrTuples<K, V> | string, v?: V): Tuples<K, V> {
	if (t instanceof Map)
		return [...t];

	if (Array.isArray(t))
		return t;

	if (isObject(t))
		return Object.entries(t) as Tuples<K, V>;

	if (isString(t) && isString(v))
		return [[t as K, v]];

	throw new TypeError(`invalid toTuples input: ${t}`);
}
