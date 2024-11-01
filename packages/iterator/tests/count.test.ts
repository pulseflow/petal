import { count } from '../src';

describe('count', () => {
	it('given non-empty iterable then returns the correct count', () => {
		const iterable = [1, 2, 3, 4, 5];
		const result = count(iterable);
		expect(result).toBe(5);
	});

	it('given empty iterable then returns 0', () => {
		const iterable: number[] = [];
		const result = count(iterable);
		expect(result).toBe(0);
	});

	it('given iterable with duplicates then returns the correct count', () => {
		const iterable = [1, 2, 2, 3, 3, 3];
		const result = count(iterable);
		expect(result).toBe(6);
	});

	it('given iterable with objects then returns the correct count', () => {
		const iterable = [{ id: 1 }, { id: 2 }, { id: 3 }];
		const result = count(iterable);
		expect(result).toBe(3);
	});
});
