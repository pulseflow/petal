import { unique } from '../src';

describe('unique', () => {
	it('given iterable with duplicates then returns iterable with duplicates removed', () => {
		const iterable = [1, 2, 2, 3, 3, 3];
		const result = [...unique(iterable)];
		expect<number[]>(result).toEqual([1, 2, 3]);
	});

	it('given iterable without duplicates then returns iterable as is', () => {
		const iterable = [1, 2, 3];
		const result = [...unique(iterable)];
		expect<number[]>(result).toEqual([1, 2, 3]);
	});

	it('given empty iterable then returns empty iterable', () => {
		const iterable = [] as number[];
		const result = [...unique(iterable)];
		expect<number[]>(result).toEqual([]);
	});
});
