import type { IterableResolvable } from './from.ts';
import { equal } from './equal.ts';

/**
 * Determines if the elements of both iterators are not equal.
 *
 * @param iterable The iterator to compare.
 * @param other The iterator to compare against.
 * @returns Whether the two iterators are not equal.
 *
 * @example
 * ```typescript
 * import { notEqual } from '@petal/iterator';
 *
 * console.log(notEqual([1], [1]));
 * // Output: false
 * console.log(notEqual([1], [1, 2]));
 * // Output: true
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export function notEqual<const ElementType>(iterable: IterableResolvable<ElementType>, other: IterableResolvable<ElementType>): boolean {
	return !equal(iterable, other);
}

export { notEqual as ne };
