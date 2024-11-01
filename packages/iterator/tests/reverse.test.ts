import { reverse } from '../src';

describe('reverse', () => {
	it('given iterable with elements then returns reversed iterable', () => {
		const iterable = [1, 2, 3];
		const result = [...reverse(iterable)];
		expect(result).toEqual([3, 2, 1]);
	});

	it('given empty iterable then returns empty iterable', () => {
		const iterable: number[] = [];
		const result = [...reverse(iterable)];
		expect(result).toEqual([]);
	});

	it('given iterable with single element then returns iterable with the same element', () => {
		const iterable = [42];
		const result = [...reverse(iterable)];
		expect(result).toEqual([42]);
	});
});
