import { every } from '../src';

describe('every', () => {
	it('given iterable and callback function that returns true for all elements then returns true', () => {
		const iterable = [1, 2, 3, 4, 5];
		const cmp = (element: number) => element > 0;
		const result = every(iterable, cmp);
		expect(result).toBe(true);
	});

	it('given iterable and callback function that returns false for at least one element then returns false', () => {
		const iterable = [1, 2, 3, 4, 5];
		const cmp = (element: number) => element > 3;
		const result = every(iterable, cmp);
		expect(result).toBe(false);
	});

	it('given empty iterable then returns true', () => {
		const iterable: number[] = [];
		const cmp = (element: number) => element > 0;
		const result = every(iterable, cmp);
		expect(result).toBe(true);
	});

	it('given iterable and invalid callback function then throws TypeError', () => {
		const iterable = [1, 2, 3, 4, 5];
		const cmp = 'invalid' as any;
		expect(() => every(iterable, cmp)).toThrow(new TypeError('invalid must be a function'));
	});
});
