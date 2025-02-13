import { average } from '../src/lib/average.ts';

describe('average', () => {
	it('given iterable with numbers then returns the average', () => {
		const iterable = [1, 2, 3, 4, 5];
		const result = average(iterable);
		expect(result).toBe(3);
	});

	it('given empty iterable then returns null', () => {
		const iterable: number[] = [];
		const result = average(iterable);
		expect(result).toBeNull();
	});

	it('given iterable with one number then returns the number itself', () => {
		const iterable = [10];
		const result = average(iterable);
		expect(result).toBe(10);
	});

	it('given iterable with negative numbers then returns the average', () => {
		const iterable = [-1, -2, -3, -4, -5];
		const result = average(iterable);
		expect(result).toBe(-3);
	});

	it('given iterable with strings then throws RangeError', () => {
		const iterable = ['a', 'e', 'c', 'b', 'd'];
		// @ts-expect-error: testing invalid input
		expect(() => average(iterable)).toThrow(new RangeError('a must be a non-NaN number'));
	});
});
