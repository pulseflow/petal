import { union } from '../src';

describe('union', () => {
	it('given multiple iterables with unique elements then returns union of all elements', () => {
		const iterable1 = [1, 2, 3];
		const iterable2 = [4, 5, 6];
		const iterable3 = [7, 8, 9];
		const result = [...union(iterable1, iterable2, iterable3)];
		expect<number[]>(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
	});

	it('given multiple iterables with duplicate elements then returns union of unique elements', () => {
		const iterable1 = [1, 2, 3];
		const iterable2 = [3, 4, 5];
		const iterable3 = [5, 6, 7];
		const result = [...union(iterable1, iterable2, iterable3)];
		expect<number[]>(result).toEqual([1, 2, 3, 4, 5, 6, 7]);
	});

	it('given empty iterables then returns empty iterable', () => {
		const iterable1: number[] = [];
		const iterable2: number[] = [];
		const result = [...union(iterable1, iterable2)];
		expect<number[]>(result).toEqual([]);
	});
});
