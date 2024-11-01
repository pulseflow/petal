import type { IterableResolvable } from './from.ts';
import { assertFunction } from './shared/_assertFunction.ts';
import { toIterableIterator } from './toIterableIterator.ts';

/**
 * Creates an iterable with the results of calling a provided function on each element.
 *
 * @param iterable An iterator to map over.
 * @param cmp A function to execute for each element produced by the iterator. Its return value is yielded by the iterator helper.
 *
 * @example
 * ```typescript
 * import { map } from '@flowr/iterator';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * console.log([...map(iterable, (value) => value * 2)]);
 * // Output: [2, 4, 6, 8, 10]
 * ```
 */
export function* map<const ElementType, const MappedType>(
	iterable: IterableResolvable<ElementType>,
	cmp: (element: ElementType, index: number) => MappedType,
): IterableIterator<MappedType> {
	cmp = assertFunction(cmp);

	let index = 0;
	for (const element of toIterableIterator(iterable))
		yield cmp(element, index++);
}
