import { findIndex } from '../src';

describe('findIndex', () => {
	it('given iterable and callback function that returns true for an element then returns the index of the element', () => {
		const iterable = [1, 2, 3, 4, 5];
		const cmp = (element: number) => element === 3;
		const result = findIndex(iterable, cmp);
		expect(result).toBe(2);
	});

	it('given iterable and callback function that returns true for multiple elements then returns the index of the first matching element', () => {
		const iterable = [1, 2, 3, 4, 5];
		const cmp = (element: number) => element > 2;
		const result = findIndex(iterable, cmp);
		expect(result).toBe(2);
	});

	it('given iterable and callback function that returns false for all elements then returns -1', () => {
		const iterable = [1, 2, 3, 4, 5];
		const cmp = (element: number) => element > 5;
		const result = findIndex(iterable, cmp);
		expect(result).toBe(-1);
	});

	it('given empty iterable then returns -1', () => {
		const iterable: number[] = [];
		const cmp = (element: number) => element === 1;
		const result = findIndex(iterable, cmp);
		expect(result).toBe(-1);
	});

	it('given iterable and invalid callback function then throws TypeError', () => {
		const iterable = [1, 2, 3, 4, 5];
		const cmp = 'invalid' as any;
		expect(() => findIndex(iterable, cmp)).toThrow(new TypeError('invalid must be a function'));
	});
});
