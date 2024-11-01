import { toArray } from '../src';

describe('toArray', () => {
	it('given iterable with elements then returns an array with the same elements', () => {
		const iterable = [1, 2, 3];
		const result = toArray(iterable);
		expect(result).toEqual([1, 2, 3]);
	});

	it('given empty iterable then returns an empty array', () => {
		const iterable: number[] = [];
		const result = toArray(iterable);
		expect(result).toEqual([]);
	});

	it('given iterable with non-primitive elements then returns an array with the same elements', () => {
		const iterable = [{ name: 'John' }, { name: 'Jane' }];
		const result = toArray(iterable);
		expect(result).toEqual([{ name: 'John' }, { name: 'Jane' }]);
	});
});
