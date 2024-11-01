import type { IterableResolvable } from './from.ts';
import { compare } from './compare.ts';
import { orderingIsLess } from './shared/_compare.ts';

/**
 * Determines if the elements of `iterable` are lexicographically greater or equal than
 * those of another.
 *
 * @param iterable The iterator to compare.
 * @param other The iterator to compare against.
 *
 * @example
 * ```typescript
 * import { greaterOrEqualThan } from '@petal/iterator';
 *
 * const x = [1, 2, 3, 4];
 * const y = [1, 4, 9, 16];
 * console.log(greaterOrEqualThan([1], [1]));
 * // Output: true
 * console.log(greaterOrEqualThan([1], [1, 2]));
 * // Output: false
 * console.log(greaterOrEqualThan([1, 2], [1]));
 * // Output: true
 * console.log(greaterOrEqualThan([1, 2], [1, 2]));
 * // Output: true
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export function greaterOrEqualThan<const ElementType>(iterable: IterableResolvable<ElementType>, other: IterableResolvable<ElementType>): boolean {
	return !orderingIsLess(compare(iterable, other));
}

export { greaterOrEqualThan as ge };
