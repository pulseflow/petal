import type { IterableResolvable } from './from.ts';
import { toIterableIterator } from './toIterableIterator.ts';

/**
 * Similar to `append`, but takes an iterable of iterables and chains them together.
 *
 * @param iterables The iterators to chain together.
 * @returns An iterator that yields the values of the provided iterators in order.
 *
 * @example
 * ```typescript
 * import { chain } from '@flowr/iterator';
 *
 * const iterable = chain([1, 2, 3], [4, 5, 6], [7, 8, 9]);
 * console.log([...iterable]);
 * // Output: [1, 2, 3, 4, 5, 6, 7, 8, 9]
 * ```
 */
export function* chain<const ElementType>(...iterables: Array<IterableResolvable<ElementType>>): IterableIterator<ElementType> {
	for (const iterable of iterables)
		yield * toIterableIterator(iterable);
}
