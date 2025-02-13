import type { IterableResolvable } from './from.ts';
import type { CompareByComparator } from './shared/_compare.ts';
import { assertFunction } from './shared/_assertFunction.ts';
import { compareIteratorElements, orderingIsLess } from './shared/_compare.ts';
import { defaultCompare } from './shared/comparators.ts';
import { toIterableIterator } from './toIterableIterator.ts';

/**
 * Returns the element that gives the minimum value from the specified function.
 *
 * If several elements are equally minimum, the last element is returned. If the iterator is empty, `null` is returned.
 *
 * @seealso {@link min} for a version that uses the default comparator.
 * @seealso {@link minBy} for a version that allows custom comparators.
 *
 * @param iterable An iterator of number values to determine the minimum value of.
 * @param cmp A function to execute for each element produced by the iterator. It should return a number value.
 * @returns The element that gives the minimum value from the specified function, or `null` if the iterator is empty.
 *
 * @example
 * ```typescript
 * import { minByKey } from '@petal/iterator';
 *
 * const iterable = [-3, 0, 1, 5, -10];
 * console.log(minByKey(iterable, (value) => Math.abs(value)));
 * // Output: 0
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export function minByKey<const ElementType, const MappedType>(
	iterable: IterableResolvable<ElementType>,
	cmp: (element: ElementType, index: number) => MappedType,
	comparator: CompareByComparator<MappedType> = defaultCompare,
): ElementType | null {
	cmp = assertFunction(cmp);

	const iterator = toIterableIterator(iterable);
	const first = iterator.next();
	if (first.done)
		return null;

	let minimum = first.value;
	let minimumKey = cmp(minimum, 0);
	let index = 1;
	for (const value of iterator) {
		const key = cmp(value, index++);
		const comparison = compareIteratorElements<MappedType>(minimumKey, key, comparator);

		if (!orderingIsLess(comparison)) {
			minimum = value;
			minimumKey = key;
		}
	}

	return minimum;
}
