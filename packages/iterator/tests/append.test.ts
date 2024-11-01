import { append } from '../src/lib/append.ts';

describe('append', () => {
	it('given iterable and one iterable then returns concatenated iterable', () => {
		const iterable1 = [1, 2, 3];
		const iterable2 = [4, 5, 6];
		const result = [...append(iterable1, iterable2)];
		expect(result).toEqual([1, 2, 3, 4, 5, 6]);
	});

	it('given iterable and multiple iterables then returns concatenated iterable', () => {
		const iterable1 = [1, 2, 3];
		const iterable2 = [4, 5, 6];
		const iterable3 = [7, 8, 9];
		const result = [...append(iterable1, iterable2, iterable3)];
		expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
	});

	it('given empty iterable then returns concatenated iterable', () => {
		const iterable1: number[] = [];
		const iterable2 = [1, 2, 3];
		const result = [...append(iterable1, iterable2)];
		expect(result).toEqual([1, 2, 3]);
	});
});
