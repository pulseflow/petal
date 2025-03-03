import type { IterableResolvable } from './from.ts';
import { toIterableIterator } from './toIterableIterator.ts';

/**
 * Creates an iterable that yields the elements of each iterable in the input iterable.
 *
 * @param iterables An iterator to map.
 * @returns An iterator that yields the entries of each iterator.
 *
 * @example
 * ```typescript
 * import { flat } from '@flowr/iterator';
 *
 * const iterable = flat([[1, 2], [3, 4], [5, 6]]);
 * console.log([...iterable]);
 * // Output: [1, 2, 3, 4, 5, 6]
 * ```
 */
export function* flat<const ElementType>(iterables: IterableResolvable<IterableResolvable<ElementType>>): IterableIterator<ElementType> {
	for (const value of toIterableIterator(iterables))
		yield* toIterableIterator(value);
}
