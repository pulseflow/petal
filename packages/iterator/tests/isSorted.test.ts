import { isSorted } from '../src/lib/isSorted.ts';

describe('isSorted', () => {
	it('given iterable with values in ascending then returns true', () => {
		const iterable = [1, 2, 2, 9];
		const result = isSorted(iterable);
		expect(result).toBe(true);
	});

	it('given iterable with values not in ascending then returns false', () => {
		const iterable = [1, 3, 2, 4];
		const result = isSorted(iterable);
		expect(result).toBe(false);
	});

	it('given iterable with a single value then always returns true', () => {
		const iterable = [0];
		const result = isSorted(iterable);
		expect(result).toBe(true);
	});

	it('given an empty iterable then always returns true', () => {
		const iterable: number[] = [];
		const result = isSorted(iterable);
		expect(result).toBe(true);
	});

	it('given iterable with strings in ascending order then returns true', () => {
		const iterable = ['a', 'b', 'c', 'd', 'e'];
		const result = isSorted(iterable);
		expect(result).toBe(true);
	});

	it('given iterable with strings not in ascending order then returns false', () => {
		const iterable = ['a', 'e', 'c', 'b', 'd'];
		const result = isSorted(iterable);
		expect(result).toBe(false);
	});
});
