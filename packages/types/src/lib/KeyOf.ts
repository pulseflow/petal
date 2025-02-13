import type { Is } from './Is.ts';
import type { PropertyKeys } from './PropertyKeys.ts';

/**
 * This is a "safe" version of the `keyof` operator, which will only return
 * keys that are both assignable to `PropertyKey` and are not `never`. This is
 * useful for extracting keys from objects that could potentially be empty, and
 * always ensuring the resulting type is at least a `PropertyKey`.
 *
 * If the {@linkcode Strict} type parameter is set to `false`, the union of
 * keys will be "anchored" with the {@linkcode PropertyKeys} branded type, to
 * allow for literal key unions to be preserved in autocomplete suggestions.
 */
export type KeyOf<T, Strict extends boolean = true> =
	| (Strict extends true ? never : PropertyKeys)
	| Is<keyof T, Strict extends true ? PropertyKey : PropertyKeys>;
