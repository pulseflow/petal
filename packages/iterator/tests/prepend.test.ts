import { prepend } from '../src';

describe('prepend', () => {
	it('given iterable and one iterable then returns prepended iterable', () => {
		const iterable1 = [1, 2, 3];
		const iterable2 = [4, 5, 6];
		const result = [...prepend(iterable1, iterable2)];
		expect(result).toEqual([4, 5, 6, 1, 2, 3]);
	});

	it('given iterable and multiple iterables then returns prepended iterable', () => {
		const iterable1 = [1, 2, 3];
		const iterable2 = [4, 5, 6];
		const iterable3 = [7, 8, 9];
		const result = [...prepend(iterable1, iterable2, iterable3)];
		expect(result).toEqual([4, 5, 6, 7, 8, 9, 1, 2, 3]);
	});

	it('given empty iterable then returns prepended iterable', () => {
		const iterable1: number[] = [];
		const iterable2 = [1, 2, 3];
		const result = [...prepend(iterable1, iterable2)];
		expect(result).toEqual([1, 2, 3]);
	});
});
