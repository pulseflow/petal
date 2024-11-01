import type { IterableResolvable } from './from.ts';
import { empty } from './empty.ts';
import { assertNotNegative } from './shared/_assertNotNegative.ts';
import { toIntegerOrInfinityOrThrow } from './shared/_toIntegerOrInfinityOrThrow.ts';
import { take } from './take.ts';
import { toArray } from './toArray.ts';

/**
 * Consumes the iterable, creating a new iterator without the last `count` elements from the iterable.
 *
 * @param iterable An iterator to drop values from.
 * @param count The number of values to drop from the end of the iterator.
 * @returns An iterator that contains the elements of the provided iterator, except for the last `count` elements.
 *
 * @example
 * ```typescript
 * import { dropLast } from '@flowr/iterator';
 *
 * const iterable = dropLast([1, 2, 3, 4, 5], 2);
 * console.log([...iterable]);
 * // Output: [1, 2, 3]
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export function dropLast<const ElementType>(iterable: IterableResolvable<ElementType>, count: number): IterableIterator<ElementType> {
	count = assertNotNegative(toIntegerOrInfinityOrThrow(count), count);
	const array = toArray(iterable);
	if (array.length <= count)
		return empty();
	return take(array.values(), array.length - count);
}
