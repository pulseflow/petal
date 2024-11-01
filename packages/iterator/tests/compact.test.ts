import { compact } from '../src';

describe('compact', () => {
	it('given iterable with null and undefined values then returns iterable without null and undefined values', () => {
		const iterable = [1, null, 2, undefined, 3];
		const result = [...compact(iterable)];
		expect(result).toEqual([1, 2, 3]);
	});

	it('given iterable with no null or undefined values then returns the same iterable', () => {
		const iterable = [1, 2, 3];
		const result = [...compact(iterable)];
		expect(result).toEqual([1, 2, 3]);
	});

	it('given empty iterable then returns empty iterable', () => {
		const iterable: number[] = [];
		const result = [...compact(iterable)];
		expect(result).toEqual([]);
	});
});
