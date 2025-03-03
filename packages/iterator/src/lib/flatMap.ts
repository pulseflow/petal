import type { IterableResolvable } from './from.ts';
import { assertFunction } from './shared/_assertFunction.ts';
import { toIterableIterator } from './toIterableIterator.ts';

/**
 * Creates an iterable that yields the elements of each iterable returned by the provided function on each element of the input iterable.
 *
 * @param iterable An iterator to map.
 * @param cmp A function to execute for each element produced by the iterator. It should return an iterator or iterable that yields elements to be yielded by `flatMap()`, or a single non-iterator/iterable value to be yielded.
 * @returns An iterator that applies a function to each element of the input iterator and yields the results.
 *
 * @example
 * ```typescript
 * import { flatMap } from '@flowr/iterator';
 *
 * const iterable = [1, 2, 3];
 * console.log([...flatMap(iterable, (value) => [value, value * 2])]);
 * // Output: [1, 2, 2, 4, 3, 6]
 * ```
 */
export function* flatMap<const ElementType, const MappedType>(
	iterable: IterableResolvable<ElementType>,
	cmp: (element: ElementType, index: number) => IterableResolvable<MappedType>,
): IterableIterator<MappedType> {
	cmp = assertFunction(cmp);

	let index = 0;
	for (const value of toIterableIterator(iterable))
		yield* toIterableIterator(cmp(value, index++));
}
