import type { IterableResolvable } from './from.ts';
import type { CompareByComparator } from './shared/_compare.ts';
import { assertFunction } from './shared/_assertFunction';
import { compareIteratorElements, orderingIsGreater } from './shared/_compare.ts';
import { toIterableIterator } from './toIterableIterator.ts';

/**
 * Checks if the elements of this iterator are sorted using the given comparator function.
 *
 * @seealso {@link isSorted} for a version that uses the default comparator.
 * @seealso {@link isSortedByKey} for a version that allows custom key extractors.
 *
 * @param iterable The iterator to compare.
 *
 * @example
 * ```typescript
 * import { ascNumber, isSortedBy } from '@petal/iterator';
 *
 * assert(isSortedBy([1, 2, 2, 9], ascNumber));
 * assert(!isSortedBy([1, 2, 2, 9], ascNumber));
 *
 * assert(isSortedBy([0], () => true));
 * assert(isSortedBy([0], () => false));
 *
 * assert(isSortedBy([], () => true));
 * assert(isSortedBy([], () => false));
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export function isSortedBy<const ElementType>(iterable: IterableResolvable<ElementType>, comparator: CompareByComparator<ElementType>): boolean {
	comparator = assertFunction(comparator);

	const iterator = toIterableIterator(iterable);
	const result = iterator.next();
	if (result.done)
		return true;

	let previous = result.value;
	for (const current of iterator) {
		const comparison = compareIteratorElements<ElementType>(previous, current, comparator);
		if (orderingIsGreater(comparison))
			return false;

		previous = current;
	}

	return true;
}
