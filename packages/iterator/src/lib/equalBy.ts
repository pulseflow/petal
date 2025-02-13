import type { IterableResolvable } from './from.ts';
import { from } from './from.ts';
import { assertFunction } from './shared/_assertFunction.ts';
import { toIterableIterator } from './toIterableIterator.ts';

/**
 * Determines if the elements of both iterators are equal with respect to the specified equality function.
 *
 * @param iterable The iterator to compare.
 * @param other The iterator to compare against.
 * @returns Whether the two iterators are equal with respect to the specified equality function.
 *
 * @example
 * ```typescript
 * import { equalBy } from '@petal/iterator';
 *
 * const x = [1, 2, 3, 4];
 * const y = [1, 4, 9, 16];
 *
 * console.log(equalBy(x, y, (a, b) => a * a === b));
 * // Output: true
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export function equalBy<const ElementType>(
	iterable: IterableResolvable<ElementType>,
	other: IterableResolvable<ElementType>,
	cmp: (x: ElementType, y: ElementType) => boolean,
): boolean {
	cmp = assertFunction(cmp);
	const iterator$1 = from(other);

	for (const value$0 of toIterableIterator(iterable)) {
		const result$1 = iterator$1.next();
		if (result$1.done || !cmp(value$0, result$1.value))
			return false;
	}

	return iterator$1.next().done === true;
}

export { equalBy as eqBy };
