import { sorted } from '../src';

describe('sorted', () => {
	it('given iterable of numbers then returns sorted iterable in ascending order', () => {
		const iterable = [3, 1, 2];
		const result = [...sorted(iterable)];
		expect(result).toEqual([1, 2, 3]);
	});

	it('given iterable of strings then returns sorted iterable in alphabetical order', () => {
		const iterable = ['c', 'a', 'b'];
		const result = [...sorted(iterable)];
		expect(result).toEqual(['a', 'b', 'c']);
	});

	it('given iterable with custom compare function then returns sorted iterable based on the compare function', () => {
		const iterable = [3, 1, 2];
		const compareFn = (a: number, b: number) => b - a; // Sort in descending order
		const result = [...sorted(iterable, compareFn)];
		expect(result).toEqual([3, 2, 1]);
	});
});
