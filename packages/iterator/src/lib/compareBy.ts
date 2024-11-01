import { from, type IterableResolvable } from './from.ts';
import { type CompareByComparator, compareIteratorElements, type LexicographicComparison, orderingIsEqual, orderingIsLess } from './shared/_compare.ts';
import { toIterableIterator } from './toIterableIterator.ts';

/**
 * {@link LexicographicComparison Lexicographically} compares the elements of both iterators are equal. That is:
 *
 * @param iterable The iterator to compare.
 * @param other The iterator to compare against.
 * @returns Whether the two iterators are equal.
 *
 * @example
 * ```typescript
 * import { ascNumber, compareBy } from '@flowr/iterator';
 *
 * const x = [1, 2, 3, 4];
 * const y = [1, 4, 9, 16];
 * console.log(compareBy(x, y, (x, y) => ascNumber(x, y)));
 * // Output: -1
 * console.log(compareBy(x, y, (x, y) => ascNumber(x * x, y)));
 * // Output: 0
 * console.log(compareBy(x, y, (x, y) => ascNumber(x * 2, y)));
 * // Output: 1
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export function compareBy<const ElementType>(
	iterable: IterableResolvable<ElementType | undefined>,
	other: IterableResolvable<ElementType | undefined>,
	comparator: CompareByComparator<ElementType>,
): LexicographicComparison {
	const iterator$1 = from(other);

	for (const x of toIterableIterator(iterable)) {
		const result$1 = iterator$1.next();
		if (result$1.done)
			return 1;

		const y = result$1.value;
		const comparison = compareIteratorElements<ElementType>(x, y, comparator);
		if (!orderingIsEqual(comparison))
			return orderingIsLess(comparison) ? -1 : 1;
	}

	return iterator$1.next().done ? 0 : -1;
}
