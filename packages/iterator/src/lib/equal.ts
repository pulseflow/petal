import type { IterableResolvable } from './from.ts';
import { equalBy } from './equalBy.ts';

/**
 * Determines if the elements of both iterators are equal.
 *
 * @param iterable The iterator to compare.
 * @param other The iterator to compare against.
 * @returns Whether the two iterators are equal.
 *
 * @example
 * ```typescript
 * import { equal } from '@petal/iterator';
 *
 * console.log(equal([1], [1]));
 * // Output: true
 * console.log(equal([1], [1, 2]));
 * // Output: false
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export function equal<const ElementType>(iterable: IterableResolvable<ElementType>, other: IterableResolvable<ElementType>): boolean {
	return equalBy(iterable, other, (a, b) => a === b);
}

export { equal as eq };
