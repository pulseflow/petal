import { at } from '../src/lib/at.ts';

describe('at', () => {
	it('given iterable and valid index then returns element at index', () => {
		const iterable = [1, 2, 3, 4, 5];
		const index = 2;
		const result = at(iterable, index);
		expect(result).toBe(3);
	});

	it('given iterable and negative index then throws RangeError', () => {
		const iterable = [1, 2, 3, 4, 5];
		const index = -1;
		expect(() => at(iterable, index)).toThrowError(new RangeError('-1 must be a non-negative number'));
	});

	it('given empty iterable then returns undefined', () => {
		const iterable: number[] = [];
		const index = 0;
		const result = at(iterable, index);
		expect(result).toBeUndefined();
	});

	it('given iterable and index greater than length then returns undefined', () => {
		const iterable = [1, 2, 3, 4, 5];
		const index = 10;
		const result = at(iterable, index);
		expect(result).toBeUndefined();
	});

	it('given iterable and Infinite index then always returns undefined', () => {
		const iterable = [1, 2, 3, 4, 5];
		const index = Infinity;
		expect(at(iterable, index)).toBeUndefined();
	});

	it('given iterable and -Infinite index then throws RangeError', () => {
		const iterable = [1, 2, 3, 4, 5];
		const index = -Infinity;
		expect(() => at(iterable, index)).toThrowError(new RangeError('-Infinity must be a non-negative number'));
	});
});
