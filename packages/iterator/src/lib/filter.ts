import type { IterableResolvable } from './from.ts';
import { assertFunction } from './shared/_assertFunction.ts';
import { toIterableIterator } from './toIterableIterator.ts';

/**
 * Creates an iterable with the elements that pass the test implemented by the provided function.
 *
 * @param iterable The iterator to filter.
 * @param cmp A function to execute for each element produced by the iterator. It should return a truthy value to make the element yielded by the iterator helper, and a falsy value otherwise.
 * @returns An iterator that produces elements from the given iterator that satisfy the specified test.
 *
 * @example
 * ```typescript
 * import { filter } from '@flowr/iterator';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * console.log([...filter(iterable, (value) => value % 2 === 0)]);
 * // Output: [2, 4]
 * ```
 */
export function filter<const ElementType, const FilteredType extends ElementType>(
	iterable: IterableResolvable<ElementType>,
	cmp: (element: ElementType, index: number) => element is FilteredType
): IterableIterator<FilteredType>;
export function filter<const ElementType>(
	iterable: IterableResolvable<ElementType>,
	cmp: (element: ElementType, index: number) => boolean
): IterableIterator<ElementType>;
export function* filter<ElementType>(
	iterable: IterableResolvable<ElementType>,
	cmp: (element: ElementType, index: number) => boolean,
): IterableIterator<ElementType> {
	cmp = assertFunction(cmp);

	let index = 0;
	for (const value of toIterableIterator(iterable))
		if (cmp(value, index++))
			yield value;
}
