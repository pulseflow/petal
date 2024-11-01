import type { IterableResolvable } from './from.ts';
import { map } from './map.ts';
import { toNumberOrThrow } from './shared/_toNumberOrThrow.ts';

/**
 * Consumes the iterable and returns the product of all the elements. If the iterable is empty, it returns `1`.
 *
 * @param iterable An iterator to calculate the product of.
 * @returns The product of the elements in the input iterator.
 *
 * @example
 * ```typescript
 * import { product } from '@flowr/iterator';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * console.log(product(iterable));
 * // Output: 120
 *
 * const iterable = [1, 2, 3, 4, 5, 0];
 * console.log(product(iterable));
 * // Output: 0
 * ```
 */
export function product(iterable: IterableResolvable<number>): number {
	let result = 1;
	for (const value of map(iterable, toNumberOrThrow))
		result *= value;

	return result;
}
