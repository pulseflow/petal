/**
 * Resolves an iterable from an iterable or iterator-like object.
 *
 * @param value The value to convert to an iterator.
 *
 * @example
 * ```typescript
 * import { from } from '@flowr/iterator';
 *
 * const iterable = from([1, 2, 3, 4, 5]);
 * for (const element of iterable) {
 * 	console.log(element);
 * 	// Output: 1, 2, 3, 4, 5
 * }
 * ```
 */
export function from<const ElementType, const ResolvableType extends IterableResolvable<ElementType>>(
	value: ResolvableType
): IterableResolved<ResolvableType>;
// eslint-disable-next-line ts/explicit-module-boundary-types -- weird types
export function from(value: any): any {
	if (typeof value === 'object' && value !== null) {
		if (typeof value[Symbol.iterator] === 'function')
			// eslint-disable-next-line ts/no-unsafe-call -- weird types
			return (value[Symbol.iterator])();

		if (typeof value.next === 'function')
			return value;
	}

	if (typeof value === 'string')
		return value[Symbol.iterator]();

	throw new TypeError(`${String(value)} cannot be converted to an iterable!`);
}

export type IterableResolvable<ElementType> =
	| Iterable<ElementType>
	| Iterator<ElementType>
	| IterableIterator<ElementType>;

export type IterableResolved<Type> =
	Type extends IterableIterator<infer Output>
		? IterableIterator<Output>
		: Type extends Iterable<infer Output>
			? Iterator<Output>
			: Type extends Iterator<infer Output>
				? Iterator<Output>
				: never;
