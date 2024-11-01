import { difference } from '../src';

describe('difference', () => {
	it('given two iterables with common elements then returns iterable with elements from first iterable except common elements', () => {
		const iterable1 = [1, 2, 3, 4, 5];
		const iterable2 = [3, 4, 5, 6, 7];
		const result = [...difference(iterable1, iterable2)];
		expect(result).toEqual([1, 2]);
	});

	it('given two iterables with no common elements then returns iterable with all elements from first iterable', () => {
		const iterable1 = [1, 2, 3];
		const iterable2 = [4, 5, 6];
		const result = [...difference(iterable1, iterable2)];
		expect(result).toEqual([1, 2, 3]);
	});

	it('given empty iterables then returns empty iterable', () => {
		const iterable1: number[] = [];
		const iterable2: number[] = [];
		const result = [...difference(iterable1, iterable2)];
		expect(result).toEqual([]);
	});
});
