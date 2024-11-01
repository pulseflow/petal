import type { IterableResolvable } from './from.ts';
import { assertFunction } from './shared/_assertFunction.ts';
import { toIterableIterator } from './toIterableIterator.ts';

/**
 * Executes a provided function once for each iterable element.
 *
 * @param iterable An iterator to iterate over.
 * @param cmp A function to execute for each element produced by the iterator. Its return value is discarded.
 *
 * @example
 * ```typescript
 * import { forEach } from '@flowr/iterator';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * forEach(iterable, (value) => console.log(value));
 * // Output: 1, 2, 3, 4, 5
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export function forEach<const ElementType>(
	iterable: IterableResolvable<ElementType>,
	cmp: (element: ElementType, index: number) => void,
): void {
	cmp = assertFunction(cmp);

	let index = 0;
	for (const element of toIterableIterator(iterable))
		cmp(element, index++);
}
