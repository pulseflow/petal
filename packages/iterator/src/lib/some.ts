import type { IterableResolvable } from './from.ts';
import { assertFunction } from './shared/_assertFunction.ts';
import { toIterableIterator } from './toIterableIterator.ts';

/**
 * Advances the iterable until it finds a matching element, returning `true` if it's found and `false` otherwise.
 *
 * @param iterable An iterator to search for a value in.
 * @param cmp A function to execute for each element produced by the iterator. It should return a truthy value to
 * indicate the element passes the test, and a falsy value otherwise.
 * @returns `true` if the callback function returns a truthy value for at least one element. Otherwise, `false`.
 *
 * @example
 * ```typescript
 * import { some } from '@flowr/iterator';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * console.log(some(iterable, (value) => value % 2 === 0));
 * // Output: true
 * ```
 *
 * @example
 * ```typescript
 * const iterable = [1, 2, 3, 4, 5];
 * console.log(some(iterable, (value) => value % 6 === 0));
 * // Output: false
 * ```
 *
 * @remarks
 *
 * This function consumes the iterator until the value is found or the iterator is exhausted.
 */
export function some<const ElementType>(
	iterable: IterableResolvable<ElementType>,
	cmp: (element: ElementType, index: number) => boolean,
): boolean {
	cmp = assertFunction(cmp);

	let index = 0;
	for (const value of toIterableIterator(iterable))
		if (cmp(value, index++))
			return true;

	return false;
}
