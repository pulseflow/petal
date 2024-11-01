import { intersect } from '../src';

describe('intersect', () => {
	it('given two arrays with common elements then returns an iterable with the common elements', () => {
		const iterable1 = [1, 2, 3, 4];
		const iterable2 = [3, 4, 5, 6];
		const result = [...intersect(iterable1, iterable2)];
		expect(result).toEqual([3, 4]);
	});

	it('given two arrays with no common elements then returns an empty iterable', () => {
		const iterable1 = [1, 2, 3];
		const iterable2 = [4, 5, 6];
		const result = [...intersect(iterable1, iterable2)];
		expect(result).toEqual([]);
	});

	it('given an empty array and a non-empty array then returns an empty iterable', () => {
		const iterable1: number[] = [];
		const iterable2 = [1, 2, 3];
		const result = [...intersect(iterable1, iterable2)];
		expect(result).toEqual([]);
	});

	it('given two empty arrays then returns an empty iterable', () => {
		const iterable1: number[] = [];
		const iterable2: number[] = [];
		const result = [...intersect(iterable1, iterable2)];
		expect(result).toEqual([]);
	});
});
