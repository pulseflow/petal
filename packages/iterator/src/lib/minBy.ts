import type { IterableResolvable } from './from.ts';
import type { CompareByComparator } from './shared/_compare.ts';
import { assertFunction } from './shared/_assertFunction.ts';
import { compareIteratorElements, orderingIsGreater } from './shared/_compare.ts';
import { toIterableIterator } from './toIterableIterator.ts';

/**
 * Returns the element that gives the minimum value with respect to the specified comparison function.
 *
 * If several elements are equally minimum, the last element is returned. If the iterator is empty, `null` is returned.
 *
 * @seealso min for a version that uses the default comparator.
 * @seealso minByKey for a version that allows custom key extractors.
 *
 * @param iterable An iterator of number values to determine the minimum value of.
 * @param comparator A function to execute for each element produced by the iterator. It should return a number value.
 * @returns The element that gives the minimum value from the specified function, or `null` if the iterator is empty.
 *
 * @example
 * ```typescript
 * import { ascNumber, minBy } from '@petal/iterator';
 *
 * const iterable = [-3, 0, 1, 5, -10];
 * console.log(minBy(iterable, ascNumber));
 * // Output: -10
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export function minBy<const ElementType>(
	iterable: IterableResolvable<ElementType>,
	comparator: CompareByComparator<ElementType>,
): ElementType | null {
	comparator = assertFunction(comparator);

	const iterator = toIterableIterator(iterable);
	const first = iterator.next();
	if (first.done)
		return null;

	let minimum = first.value;
	for (const value of iterator) {
		const comparison = compareIteratorElements<ElementType>(value, minimum, comparator);

		if (!orderingIsGreater(comparison))
			minimum = value;
	}

	return minimum;
}
