import type { IterableResolvable } from './from.ts';
import { map } from './map.ts';
import { type NumberResolvable, toNumberOrThrow } from './shared/_toNumberOrThrow.ts';

/**
 * Consumes the iterable and returns the average value of all the elements. If the iterable is empty, it returns `null`.
 *
 * @param iterable The iterator to calculate the average of.
 * @returns The average of the sequence of numbers, or `null` if the sequence is empty or contains only non-number values.
 *
 * @example
 * ```typescript
 * import { average } from '@flowr/iterator';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * console.log(average(iterable));
 * // Output: 3
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export function average(iterable: IterableResolvable<NumberResolvable>): number | null {
	let sum = 0;
	let total = 0;
	for (const value of map(iterable, toNumberOrThrow)) {
		sum += value;
		total++;
	}

	return total === 0 ? null : sum / total;
}
