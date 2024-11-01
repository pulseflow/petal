import { min } from '../src';

describe('min', () => {
	it('given iterable with numbers then returns the lexicographic minimum value', () => {
		const iterable = [5, 2, 8, 1, 10];
		const result = min(iterable);
		expect(result).toBe(1);
	});

	it('given iterable with negative numbers then returns the lexicographic minimum value', () => {
		const iterable = [-5, -2, -8, -1, -10];
		const result = min(iterable);
		expect(result).toBe(-1);
	});

	it('given iterable with mixed positive and negative numbers then returns the lexicographic minimum value', () => {
		const iterable = [-5, 2, -8, 1, -10];
		const result = min(iterable);
		expect(result).toBe(-10);
	});

	it('given iterable with one element then returns the element', () => {
		const iterable = [1];
		const result = min(iterable);
		expect(result).toBe(1);
	});

	it('given empty iterable then returns null', () => {
		const iterable: number[] = [];
		const result = min(iterable);
		expect(result).toBeNull();
	});

	it('given iterable with strings then returns the lexicographic minimum value', () => {
		const iterable = ['a', 'e', 'c', 'b', 'd'];
		expect(min(iterable)).toBe('a');
	});
});
