import { cycle, take } from '../src';

describe('cycle', () => {
	it('given iterable with elements then returns infinite iterable cycling through the elements', () => {
		const iterable = [1, 2, 3];
		const result = [...take(cycle(iterable), 9)];
		expect(result).toEqual([1, 2, 3, 1, 2, 3, 1, 2, 3]); // The cycle repeats indefinitely
	});

	it('given empty iterable then returns empty iterable', () => {
		const iterable: number[] = [];
		const result = [...cycle(iterable)];
		expect(result).toEqual([]);
	});
});
