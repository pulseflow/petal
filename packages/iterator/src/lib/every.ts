import type { IterableResolvable } from './from.ts';
import { assertFunction } from './shared/_assertFunction.ts';
import { toIterableIterator } from './toIterableIterator.ts';

/**
 * Tests whether all elements in the iterable pass the test implemented by the provided function.
 *
 * @param iterable The iterator to check.
 * @param cmp A function to execute for each element produced by the iterator. It should return a truthy value to indicate the element passes the test, and a falsy value otherwise.
 * @returns `true` if cmp returns a truthy value for every element. Otherwise, `false`.
 *
 * @example
 * ```typescript
 * import { every } from '@flowr/iterator';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * console.log(every(iterable, (value) => value < 10));
 * // Output: true
 *
 * console.log(every(iterable, (value) => value < 3));
 * // Output: false
 * ```
 *
 * @remarks This function consumes the entire iterator.
 */
export function every<const ElementType, const FilteredType extends ElementType>(
	iterable: IterableResolvable<ElementType>,
	cmp: (element: ElementType, index: number) => element is FilteredType
): iterable is IterableIterator<FilteredType>;
export function every<const ElementType>(
	iterable: IterableResolvable<ElementType>,
	cmp: (element: ElementType, index: number) => boolean
): boolean;
export function every<const ElementType>(
	iterable: IterableResolvable<ElementType>,
	cmp: (element: ElementType, index: number) => boolean,
): boolean {
	cmp = assertFunction(cmp);

	let index = 0;
	for (const value of toIterableIterator(iterable))
		if (!cmp(value, index++))
			return false;

	return true;
}
