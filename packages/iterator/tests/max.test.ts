import { max } from '../src';

describe('max', () => {
	it('given iterable with numbers then returns the lexicographic maximum value', () => {
		const iterable = [1, 5, 3, 2, 4];
		const result = max(iterable);
		expect(result).toBe(5);
	});

	it('given iterable with negative numbers then returns the lexicographic maximum value', () => {
		const iterable = [-1, -5, -3, -2, -4];
		const result = max(iterable);
		expect(result).toBe(-1);
	});

	it('given iterable with one element then returns the element', () => {
		const iterable = [1];
		const result = max(iterable);
		expect(result).toBe(1);
	});

	it('given empty iterable then returns null', () => {
		const iterable: number[] = [];
		const result = max(iterable);
		expect(result).toBeNull();
	});

	it('given iterable with strings then returns the lexicographic maximum value', () => {
		const iterable = ['a', 'e', 'c', 'b', 'd'];
		expect(max(iterable)).toBe('e');
	});
});
