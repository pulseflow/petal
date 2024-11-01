import { indexOf } from '../src';

describe('indexOf', () => {
	it('given iterable and value that exists in the iterable then returns the index of the value', () => {
		const iterable = [1, 2, 3, 4, 5];
		const value = 3;
		const result = indexOf(iterable, value);
		expect(result).toBe(2);
	});

	it('given iterable and value that does not exist in the iterable then returns -1', () => {
		const iterable = [1, 2, 3, 4, 5];
		const value = 6;
		const result = indexOf(iterable, value);
		expect(result).toBe(-1);
	});

	it('given empty iterable then returns -1', () => {
		const iterable: number[] = [];
		const value = 1;
		const result = indexOf(iterable, value);
		expect(result).toBe(-1);
	});
});
