import type { Arrayable, ExtractKeysByType, Nullable } from '../types';
import { clamp } from './math';

/**
 * Convert an `Arrayable<T>` to an `Array<T>`.
 *
 * @param array The `Arrayable<T>` to be converted.
 * @returns The `Array<T>` derived from `array`.
 * @example const array: Array<number> = toArray([3, 5, 6, 7]);
 * @example const array: Array<number> = toArray(1); // Arrayable<T> supports non-arrays!
 * @category Array
 */
export function toArray<T>(array?: Nullable<Arrayable<T>>): Array<T> {
	array = array ?? [];
	return Array.isArray(array) ? array : [array];
}

/**
 * Convert `Arrayable<T>` to `Array<T>` and flatten it.
 *
 * @param array The `Arrayable<T>` to convert and flatten.
 * @returns The flat `Array<T>` derived from `array`.
 * @example const flattened: Array<number> = flattenArrayable([[1, 2, 3, 4], 3, 5, 6, 7]);
 * @example const flattened: Array<number> = flattenArrayable(1); // Arrayable<T> supports non-arrays!
 * @category Array
 */
export const flattenArrayable = <T>(array?: Nullable<Arrayable<T | Array<T>>>): Array<T> => toArray(array).flat(1) as Array<T>;

/**
 * Merge multiple nullable `Array<T>`s and `Arrayable<T>`s into one `Array<T>`.
 *
 * @param args The nullable list of arrayable items (all of one type).
 * @returns Flat map of the merged arrayable as `Array<T>`.
 * @example const merged: Array<number> = mergeArrayable([1, 2, 3, 4], [5, 6, 7, 8]);
 * @category Array
 */
export const mergeArrayable = <T>(...args: Nullable<Arrayable<T>>[]): Array<T> => args.flatMap(i => toArray(i));

/**
 * A function which filters a partionable `T[]`, taking in the callback of `Array<T>.forEach`.
 *
 * @param i The element to be processed.
 * @param idx The index of the element to be procedded.
 * @param arr The original readonly array.
 * @returns The processed element.
 * @example const [odd, even] = partition([1, 2, 3, 4], i => i % 2 != 0) // i => i % 2 != 0 is the `PartitionFilter<number>`
 * @see category#Array: function partition
 * @category Array
 */
export type PartitionFilter<T> = (i: T, idx: number, arr: readonly T[]) => any;

/**
 * Divide an array into two parts with a filter/processor function.
 *
 * @param array The `T[]` array to be partitioned.
 * @returns The partitioned `T[]` arrays, in the data type of `T[][]`
 * @example const [odd, even] = partition([1, 2, 3, 4], i => i % 2 != 0)
 * @see category#Array: type PartitionFilter
 * @category Array
 */
export function partition<T>(array: readonly T[], f1: PartitionFilter<T>): [T[], T[]];
export function partition<T>(array: readonly T[], f1: PartitionFilter<T>, f2: PartitionFilter<T>): [T[], T[], T[]];
export function partition<T>(array: readonly T[], f1: PartitionFilter<T>, f2: PartitionFilter<T>, f3: PartitionFilter<T>): [T[], T[], T[], T[]];
export function partition<T>(array: readonly T[], f1: PartitionFilter<T>, f2: PartitionFilter<T>, f3: PartitionFilter<T>, f4: PartitionFilter<T>): [T[], T[], T[], T[], T[]];
export function partition<T>(array: readonly T[], f1: PartitionFilter<T>, f2: PartitionFilter<T>, f3: PartitionFilter<T>, f4: PartitionFilter<T>, f5: PartitionFilter<T>): [T[], T[], T[], T[], T[], T[]];
export function partition<T>(array: readonly T[], f1: PartitionFilter<T>, f2: PartitionFilter<T>, f3: PartitionFilter<T>, f4: PartitionFilter<T>, f5: PartitionFilter<T>, f6: PartitionFilter<T>): [T[], T[], T[], T[], T[], T[], T[]];
export function partition<T>(array: readonly T[], ...filters: PartitionFilter<T>[]): any {
	const result: T[][] = Array.from({ length: filters.length + 1 }).fill(null).map(() => []);

	array.forEach((e, idx, arr) => {
		let i = 0;
		for (const filter of filters) {
			if (filter(e, idx, arr)) {
				result[i].push(e);
				return;
			}
			i += 1;
		}
		result[i].push(e);
	});
	return result;
}

/**
 * Unique an Array
 *
 * @param array The `T[]` array to be uniqued.
 * @returns The `T[]` array with a `Set` transformer.
 * @example const uniqueArray: Array<number> = uniq([1, 2, 2, 3, 4, 5]);
 * @category Array
 */
export const uniq = <T>(array: readonly T[]): T[] => Array.from(new Set(array));

/**
 * Unique an Array by a custom equality function
 *
 * @param array The `T[]` array to be transformed.
 * @param equalFn A function that accepts two reduced T values and returns a boolean.
 * @returns The transformed `T[]` array.
 * @example const uniqueArray: Array<number> = uniqueBy([1, 2, 3, 3, 4, 5], (a, b) => true);
 * @category Array
 */
export function uniqueBy<T>(array: readonly T[], equalFn: (a: T, b: T) => boolean): T[] {
	return array.reduce((acc: T[], cur) => {
		if (acc.findIndex(item => equalFn(cur, item)) === -1)
			acc.push(cur);
		return acc;
	}, []);
}

/**
 * Get last item
 *
 * @param array A readonly array to get the last item of.
 * @example const lastItem: number = last([1, 2, 3, 4]); // 4
 * @example const lastItem = last([]) // undefined
 * @category Array
 */
export function last(array: readonly []): undefined;
export function last<T>(array: readonly T[]): T;
export function last<T>(array: readonly T[]): T | undefined {
	return at(array, -1);
}

/**
 * Remove an item from Array
 *
 * @param array The `T[]` array to be removed from.
 * @param value The value to be removed (not the index).
 * @returns If the value exists or not, and if the item could be removed.
 * @example const removedArray: Array<number> = remove([1, 2, 3, 4], 1); // [2, 3, 4]
 * @category Array
 */
export function remove<T>(array: T[], value: T): boolean {
	if (!array)
		return false;
	const index = array.indexOf(value);
	if (index >= 0) {
		array.splice(index, 1);
		return true;
	}
	return false;
}

/**
 * Get nth item of Array. Negative for backward
 *
 * @param array The array to be indexed.
 * @param index The index of the array to get.
 * @example const arrayItem: number = at([1, 2, 3], 1); // 2
 * @category Array
 */
export function at(array: readonly [], index: number): undefined;
export function at<T>(array: readonly T[], index: number): T;
export function at<T>(array: readonly T[] | [], index: number): T | undefined {
	const len = array.length;
	if (!len)
		return undefined;
	if (index < 0)
		index += len;
	return array[index];
}

/**
 * Generate a range array of numbers. The `stop` is exclusive.
 *
 * @returns The array range as `number[]`.
 * @example const arrayRange: Array<number> = range(2, 10, 2); // [2, 4, 6, 8]
 * @example const arrayRange: Array<number> = range(2, 5); // [2, 3, 4]
 * @example const arrayRange: Array<number> = range(2); // [0, 1]
 * @category Array
 */
export function range(stop: number): number[];
export function range(start: number, stop: number, step?: number): number[];
export function range(...args: any): number[] {
	let start: number, stop: number, step: number;

	if (args.length === 1) {
		start = 0;
		step = 1;
		([stop] = args);
	}
	else {
		([start, stop, step = 1] = args);
	}

	const array: number[] = [];
	let current = start;
	while (current < stop) {
		array.push(current);
		current += step || 1;
	}

	return array;
}

/**
 * Move element in an Array
 *
 * @category Array
 * @param array The array to move an element from.
 * @param from The index in the array to be moved.
 * @param to The index to move the element to.
 * @returns The `array` parameter with the element moved.
 */
export function move<T>(array: T[], from: number, to: number): T[] {
	array.splice(to, 0, array.splice(from, 1)[0]);
	return array;
}

/**
 * Clamp a number to the index range of an array
 *
 * @param n The index number to be clamped.
 * @param array The readonly array to be clamped in a range.
 * @returns The clamped array range as a number.
 * @example const arrayRange: number = clampArrayRange(30, [1, 2, 3, 4]);
 * @category Array
 */
export const clampArrayRange = (n: number, array: readonly unknown[]): number => clamp(n, 0, array.length - 1);

/**
 * Get random element(s) from an array
 *
 * @category Array
 * @param array The array to get the items from.
 * @param quantity Quantity of random items which will be returned.
 * @returns The random sample of items in the array.
 * @example const randomResponse = sample(['response', 'another response'], 1); // one of the two responses
 */
export const sample = <T>(array: T[], quantity: number): T[] => Array.from({ length: quantity }, _ => array[Math.round(Math.random() * (array.length - 1))]);

/**
 * Shuffle an array. This function mutates the array.
 *
 * @category Array
 */
export function shuffle<T>(array: T[]): T[] {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

export const max = <T>(arr: T[], prop: ExtractKeysByType<T, number>): number => Math.max(...arr.map(a => a[prop] as number));
export const max_by = <T>(arr: T[], prop: ExtractKeysByType<T, number>): T => arr.reduce((a, b) => a[prop] > b[prop] ? a : b);
export const max_map = <T, U>(arr: T[], fn: (a: T) => U): T => arr.reduce((a, b) => fn(a) > fn(b) ? a : b);
export const min = <T>(arr: T[], prop: ExtractKeysByType<T, number>): number => Math.max(...arr.map(a => a[prop] as number));
export const min_by = <T>(arr: T[], prop: ExtractKeysByType<T, number>): T => arr.reduce((a, b) => a[prop] < b[prop] ? a : b);
export const min_map = <T, U>(arr: T[], fn: (a: T) => U): T => arr.reduce((a, b) => fn(a) < fn(b) ? a : b);
export const zip = <T>(...arr: T[][]): T[][] => Array(max(arr, 'length')).fill(null).map((_, i) => arr.map(a => a[i]));
export const get_dimension = (a: any, d = 0): number => Array.isArray(a) ? get_dimension(a[0], d + 1) : d;

export function group_by<T>(arr: T[], prop: keyof T): T[][] {
	const groups = new Map<any, T[]>();
	arr.forEach((a) => {
		const key = a[prop];
		if (!groups.has(key))
			groups.set(key, []);
		groups.get(key)!.push(a);
	});

	return [...groups.values()];
}
