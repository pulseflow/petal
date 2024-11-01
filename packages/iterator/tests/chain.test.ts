import { chain } from '../src/lib/chain.ts';

describe('chain', () => {
	it('given multiple iterables then returns concatenated iterable', () => {
		const iterable1 = [1, 2, 3];
		const iterable2 = [4, 5, 6];
		const iterable3 = [7, 8, 9];
		const result = [...chain(iterable1, iterable2, iterable3)];
		expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
	});

	it('given empty iterables then returns empty iterable', () => {
		const iterable1: number[] = [];
		const iterable2: number[] = [];
		const iterable3: number[] = [];
		const result = [...chain(iterable1, iterable2, iterable3)];
		expect(result).toEqual([]);
	});

	it('given single iterable then returns the same iterable', () => {
		const iterable = [1, 2, 3];
		const result = [...chain(iterable)];
		expect(result).toEqual([1, 2, 3]);
	});
});
