import type { IterableResolvable } from './from.ts';
import { empty } from './empty.ts';
import { assertNotNegative } from './shared/_assertNotNegative.ts';
import { toIntegerOrInfinityOrThrow } from './shared/_toIntegerOrInfinityOrThrow.ts';
import { toIterableIterator } from './toIterableIterator.ts';

/**
 * Advances the iterable by `count` elements from the iterable.
 *
 * @param iterable An iterator to drop values from.
 * @param count The number of elements to drop from the start of the iteration.
 * @returns An iterator that contains the elements of the provided iterator, except for the first `count` elements.
 *
 * @example
 * ```typescript
 * import { drop } from '@flowr/iterator';
 *
 * const iterable = drop(iterator, 2);
 * console.log([...iterable]);
 * // Output: [3, 4, 5]
 * ```
 */
export function drop<const ElementType>(iterable: IterableResolvable<ElementType>, count: number): IterableIterator<ElementType> {
	count = assertNotNegative(toIntegerOrInfinityOrThrow(count), count);
	const resolvedIterable = toIterableIterator(iterable);

	// If the count is 0, return the original iterable:
	if (count === 0)
		return resolvedIterable;
	// If the count is infinite, return an empty iterable:
	if (count === Number.POSITIVE_INFINITY)
		return empty();

	for (let i = 0; i < count; i++)
		if (resolvedIterable.next().done)
			break;

	return resolvedIterable;
}
