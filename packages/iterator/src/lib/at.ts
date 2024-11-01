import type { IterableResolvable } from './from.ts';
import { drop } from './drop.ts';
import { first } from './first.ts';
import { assertNotNegative } from './shared/_assertNotNegative.ts';
import { toIntegerOrInfinityOrThrow } from './shared/_toIntegerOrInfinityOrThrow.ts';

/**
 * Advances the iterable to the `n`th element and returns it. If the iterable is exhausted before reaching the `n`th element, it returns `undefined`.
 *
 * @param iterable An iterator to return an element from.
 * @param index The index of the element to retrieve.
 * @returns The element at the specified index, or `undefined` if the index is out of range.
 *
 * @example
 * ```typescript
 * import { at } from '@flowr/iterator';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * console.log(at(iterable, 2));
 * // Output: 3
 * ```
 *
 * @remarks
 *
 * This function consumes the input iterator up to the specified index.
 */
export function at<const ElementType>(iterable: IterableResolvable<ElementType>, index: number): ElementType | undefined {
	index = assertNotNegative(toIntegerOrInfinityOrThrow(index), index);
	return first(index === 0 ? iterable : drop(iterable, index));
}
