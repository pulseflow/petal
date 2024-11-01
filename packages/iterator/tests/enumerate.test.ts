import { enumerate } from '../src';

describe('enumerate', () => {
	it('given iterable with elements then returns iterable with index-value pairs', () => {
		const iterable = ['a', 'b', 'c'];
		const result = [...enumerate(iterable)];
		expect(result).toEqual([
			[0, 'a'],
			[1, 'b'],
			[2, 'c'],
		]);
	});

	it('given empty iterable then returns empty iterable', () => {
		const iterable: string[] = [];
		const result = [...enumerate(iterable)];
		expect(result).toEqual([]);
	});

	it('given iterable with one element then returns iterable with one index-value pair', () => {
		const iterable = ['a'];
		const result = [...enumerate(iterable)];
		expect(result).toEqual([[0, 'a']]);
	});
});
