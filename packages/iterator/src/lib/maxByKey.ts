import type { IterableResolvable } from './from.ts';
import { assertFunction } from './shared/_assertFunction.ts';
import { type CompareByComparator, compareIteratorElements, orderingIsGreater } from './shared/_compare.ts';
import { defaultCompare } from './shared/comparators.ts';
import { toIterableIterator } from './toIterableIterator.ts';

/**
 * Returns the element that gives the maximum value from the specified function.
 *
 * If several elements are equally maximum, the last element is returned. If the iterator is empty, `null` is returned.
 *
 * @seealso {@link max} for a version that uses the default comparator.
 * @seealso {@link maxBy} for a version that allows custom comparators.
 *
 * @param iterable An iterator of number values to determine the maximum value of.
 * @param cmp A function to execute for each element produced by the iterator, producing a key to compare with.
 * @param comparator A function to execute for each element produced by the iterator. It should return a number value.
 * @returns The element that gives the maximum value from the specified function, or `null` if the iterator is empty.
 *
 * @example
 * ```typescript
 * import { maxByKey } from '@petal/iterator';
 *
 * const iterable = [-3, 0, 1, 5, -10];
 * console.log(maxByKey(iterable, (value) => Math.abs(value)));
 * // Output: -10
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export function maxByKey<const ElementType, const MappedType>(
	iterable: IterableResolvable<ElementType>,
	cmp: (element: ElementType, index: number) => MappedType,
	comparator: CompareByComparator<MappedType> = defaultCompare,
): ElementType | null {
	cmp = assertFunction(cmp);

	const iterator = toIterableIterator(iterable);
	const first = iterator.next();
	if (first.done)
		return null;

	let maximum = first.value;
	let maximumKey = cmp(maximum, 0);
	let index = 1;
	for (const value of iterator) {
		const key = cmp(value, index++);
		const comparison = compareIteratorElements<MappedType>(maximumKey, key, comparator);

		if (!orderingIsGreater(comparison)) {
			maximum = value;
			maximumKey = key;
		}
	}

	return maximum;
}
