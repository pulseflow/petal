import type { IterableResolvable } from './from.ts';
import { compare } from './compare.ts';
import { orderingIsGreater } from './shared/_compare.ts';

/**
 * Determines if the elements of `iterable` are {@link LexicographicComparison lexicographically} greater than those of
 * another.
 *
 * @param iterable The iterator to compare.
 * @param other The iterator to compare against.
 *
 * @example
 * ```typescript
 * import { greaterThan } from '@petal/iterator';
 *
 * const x = [1, 2, 3, 4];
 * const y = [1, 4, 9, 16];
 * console.log(greaterThan([1], [1]));
 * // Output: false
 * console.log(greaterThan([1], [1, 2]));
 * // Output: false
 * console.log(greaterThan([1, 2], [1]));
 * // Output: true
 * console.log(greaterThan([1, 2], [1, 2]));
 * // Output: false
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export function greaterThan<const ElementType>(iterable: IterableResolvable<ElementType>, other: IterableResolvable<ElementType>): boolean {
	return orderingIsGreater(compare(iterable, other));
}

export { greaterThan as gt };
