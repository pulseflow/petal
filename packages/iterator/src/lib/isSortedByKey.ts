import type { IterableResolvable } from './from.ts';
import type { CompareByComparator } from './shared/_compare.ts';
import { assertFunction } from './shared/_assertFunction.ts';
import { compareIteratorElements, orderingIsGreater } from './shared/_compare.ts';
import { defaultCompare } from './shared/comparators.ts';
import { toIterableIterator } from './toIterableIterator.ts';

/**
 * Checks if the elements of this iterator are sorted using the given key extraction function.
 *
 * Instead of comparing the iterator's elements directly, this function compares the keys of the elements, as determined
 * by `cmp`. Apart from that, it's equivalent to {@link isSorted}; see its documentation for more information.
 *
 * @seealso {@link isSorted} for a version that uses the default comparator.
 * @seealso {@link isSortedBy} for a version that allows custom comparators.
 *
 * @param iterable The iterator to compare.
 * @param cmp The function to extract the key from an element.
 *
 * @example
 * ```typescript
 * import { isSortedByKey } from '@petal/iterator';
 *
 * assert(isSortedByKey(['c', 'bb', 'aaa'], (s) => s.length));
 * assert(!isSortedBy([-2, -1, 0, 3], (n) => Math.abs(n)));
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export function isSortedByKey<const ElementType, const MappedType>(
	iterable: IterableResolvable<ElementType>,
	cmp: (a: ElementType, index: number) => MappedType,
	comparator: CompareByComparator<MappedType> = defaultCompare,
): boolean {
	cmp = assertFunction(cmp);

	const iterator = toIterableIterator(iterable);
	const result = iterator.next();
	if (result.done)
		return true;

	let previousKey = cmp(result.value, 0);
	let index = 1;
	for (const current of iterator) {
		const currentKey = cmp(current, index++);
		const comparison = compareIteratorElements<MappedType>(previousKey, currentKey, comparator);
		if (orderingIsGreater(comparison))
			return false;

		previousKey = currentKey;
	}

	return true;
}
