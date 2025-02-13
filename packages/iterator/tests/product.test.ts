import { product } from '../src';

describe('product', () => {
	it('given iterable with numbers then returns the product of all numbers', () => {
		const iterable = [1, 2, 3, 4, 5];
		const result = product(iterable);
		expect(result).toEqual(120);
	});

	it('given iterable with negative numbers then returns the product of all numbers', () => {
		const iterable = [-1, -2, -3, -4, -5];
		const result = product(iterable);
		expect(result).toEqual(-120);
	});

	it('given iterable with zero then returns zero', () => {
		const iterable = [1, 2, 0, 4, 5];
		const result = product(iterable);
		expect(result).toEqual(0);
	});

	it('given iterable with one element then returns the element', () => {
		const iterable = [5];
		const result = product(iterable);
		expect(result).toBe(5);
	});

	it('given empty iterable then returns 1', () => {
		const iterable: number[] = [];
		const result = product(iterable);
		expect(result).toEqual(1);
	});

	it('given iterable with strings then returns the maximum value', () => {
		const iterable = ['a', 'e', 'c', 'b', 'd'];
		// @ts-expect-error: Testing invalid input
		expect(() => product(iterable)).toThrow(new RangeError('a must be a non-NaN number'));
	});
});
