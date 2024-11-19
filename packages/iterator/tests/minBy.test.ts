import { ascNumber, ascString, defaultCompare, descNumber, descString, minBy } from '../src';

describe('minBy', () => {
	it('given iterable with positive numbers by ascending string and asc comparator then returns the lexicographic minimum value', () => {
		const iterable = [1, 5, 3, 2, 4];
		const result = minBy(iterable, ascString);
		expect(result).toBe(1);
	});

	it('given iterable with negative numbers by descending string and desc comparator then returns the lexicographic maximum value', () => {
		const iterable = [-1, -5, -3, -2, -4];
		const result = minBy(iterable, descString);
		expect(result).toBe(-5);
	});

	it('given iterable with positive numbers by ascending number and asc comparator then returns the minimum value', () => {
		const iterable = [1, 5, 3, 2, 4];
		const result = minBy(iterable, ascNumber);
		expect(result).toBe(1);
	});

	it('given iterable with negative numbers by descending number and desc comparator then returns the maximum value', () => {
		const iterable = [-1, -5, -3, -2, -4];
		const result = minBy(iterable, descNumber);
		expect(result).toBe(-1);
	});

	it('given iterable with one element then returns the element', () => {
		const iterable = [1];
		const result = minBy(iterable, defaultCompare);
		expect(result).toBe(1);
	});

	it('given empty iterable then returns null', () => {
		const iterable: number[] = [];
		const result = minBy(iterable, defaultCompare);
		expect(result).toBeNull();
	});

	it('given iterable with strings and asc comparator then then returns the lexicographic minimum value', () => {
		const iterable = ['a', 'e', 'c', 'b', 'd'];
		expect(minBy(iterable, defaultCompare)).toBe('a');
	});
});
