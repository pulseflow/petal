import type { IterableResolvable } from './from.ts';
import { map } from './map.ts';
import { type NumberResolvable, toNumberOrThrow } from './shared/_toNumberOrThrow.ts';

/**
 * Consumes the iterable and returns the sum of all the elements.
 *
 * @param iterable An iterator of numbers to calculate the sum of.
 * @returns The sum of the numbers in the input iterator.
 *
 * @example
 * ```typescript
 * import { sum } from '@flowr/iterator';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * console.log(sum(iterable));
 * // Output: 15
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export function sum(iterable: IterableResolvable<NumberResolvable>): number {
	let sum = 0;
	for (const value of map(iterable, toNumberOrThrow))
		sum += value;

	return sum;
}
