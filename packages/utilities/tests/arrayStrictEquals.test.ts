import { arrayStrictEquals } from '../src';

describe('arrayStrictEquals', () => {
	it('given same array then returns true', () => {
		const arr: unknown[] = [];
		expect(arrayStrictEquals(arr, arr)).toBe(true);
	});

	it('given cloned array then returns true', () => {
		const arr: unknown[] = [];
		const clone = arr.slice();
		expect(arrayStrictEquals(arr, clone)).toBe(true);
	});

	it('given arrays of same length then returns true', () => {
		const arr: number[] = [1];
		const arr2: number[] = [1];

		expect(arrayStrictEquals(arr, arr2)).toBe(true);
	});

	it('given arrays of different length then returns false', () => {
		const arr: number[] = [1];
		const arr2: number[] = [1, 2];

		expect(arrayStrictEquals(arr, arr2)).toBe(false);
	});

	it('given different arrays then returns false', () => {
		const arr: number[] = [1];
		const arr2: number[] = [2];

		expect(arrayStrictEquals(arr, arr2)).toBe(false);
	});

	it('given array with different types then returns false', () => {
		const arr: number[] = [1, 2, 3];
		const arr2: Array<number | string> = [1, 2, '3'];

		expect(arrayStrictEquals(arr, arr2)).toBe(false);
	});

	it('given array with order then returns false', () => {
		const arr: number[] = [3, 1, 2];
		const arr2: number[] = [1, 2, 3];

		expect(arrayStrictEquals(arr, arr2)).toBe(false);
	});
});
