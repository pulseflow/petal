import { dropLast } from '../src';

describe('dropLast', () => {
	it('given iterable and count less than or equal to iterable length then returns empty iterable', () => {
		const iterable = [1, 2, 3];
		const count = 3;
		const result = [...dropLast(iterable, count)];
		expect(result).toEqual([]);
	});

	it('given iterable and count greater than iterable length then returns iterable without last elements', () => {
		const iterable = [1, 2, 3];
		const count = 2;
		const result = [...dropLast(iterable, count)];
		expect(result).toEqual([1]);
	});

	it('given empty iterable then returns empty iterable', () => {
		const iterable: number[] = [];
		const count = 2;
		const result = [...dropLast(iterable, count)];
		expect(result).toEqual([]);
	});

	it('given negative count then throws RangeError', () => {
		const iterable = [1, 2, 3];
		const count = -1;
		expect(() => [...dropLast(iterable, count)]).toThrow(new RangeError('-1 must be a non-negative number'));
	});
});
