import { takeLast } from '../src';

describe('takeLast', () => {
	it('given iterable and limit then returns last elements of iterable', () => {
		const iterable = [1, 2, 3, 4, 5];
		const limit = 3;
		const result = [...takeLast(iterable, limit)];
		expect(result).toEqual([3, 4, 5]);
	});

	it('given iterable with fewer elements than limit then returns all elements of iterable', () => {
		const iterable = [1, 2, 3];
		const limit = 5;
		const result = [...takeLast(iterable, limit)];
		expect(result).toEqual([1, 2, 3]);
	});

	it('given iterable and limit of Infinity then returns all elements of iterable', () => {
		const iterable = [1, 2, 3];
		const limit = Number.POSITIVE_INFINITY;
		const result = [...takeLast(iterable, limit)];
		expect(result).toEqual([1, 2, 3]);
	});

	it('given empty iterable then returns empty iterable', () => {
		const iterable: number[] = [];
		const limit = 3;
		const result = [...takeLast(iterable, limit)];
		expect(result).toEqual([]);
	});

	it('given limit of 0 then returns empty iterable', () => {
		const iterable = [1, 2, 3];
		const limit = 0;
		const result = [...takeLast(iterable, limit)];
		expect(result).toEqual([]);
	});

	it('given negative limit then throws an error', () => {
		const iterable = [1, 2, 3];
		const limit = -1;
		expect(() => takeLast(iterable, limit)).toThrowError('-1 must be a non-negative number');
	});
});
