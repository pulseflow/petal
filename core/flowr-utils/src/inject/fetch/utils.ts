import type { RecordOrTuples, Tuples } from './types.js';

export const toJson = <T = any>(res: Response) => res.json() as Promise<T>;
export const toText = (res: Response) => res.text();
export const toBlob = (res: Response) => res.blob();
export const toArrayBuffer = (res: Response) => res.arrayBuffer();

export function toTuples<K extends string, V>(
	t: RecordOrTuples<K, V> | string,
	v?: V,
): Tuples<K, V> {
	if (t instanceof Map)
		return [...t];

	if (Array.isArray(t))
		return t;

	if (typeof t === 'object')
		return Object.entries(t) as Tuples<K, V>;

	if (typeof t === 'string' && typeof v === 'string')
		return [[t as K, v]];

	throw new TypeError(`invalid toTuples() input: ${t}`);
}
