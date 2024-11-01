import { unzip } from '../src';

describe('unzip', () => {
	it('given iterable with valid arrays then returns unzipped iterables', () => {
		const iterable = [
			[1, 'a'],
			[2, 'b'],
			[3, 'c'],
		] as Array<[number, string]>;
		const [numbers, letters] = unzip(iterable);
		expect<number[]>(numbers).toEqual([1, 2, 3]);
		expect<string[]>(letters).toEqual(['a', 'b', 'c']);
	});

	it('given iterable with empty array then throws an error', () => {
		const iterable: number[][] = [];
		expect(() => unzip(iterable)).toThrowError('Cannot unzip an empty iterable');
	});

	it('given iterable with non-array value then throws an error', () => {
		const iterable = [1, 2, 3];
		// @ts-expect-error: Testing invalid input
		expect(() => unzip(iterable)).toThrowError('Cannot unzip an iterable that does not yield an array');
	});

	it('given iterable with one non-array value then throws an error', () => {
		const iterable = [[1, 'a'], 2, [3, 'c']];
		// @ts-expect-error: Testing invalid input
		expect(() => unzip(iterable)).toThrowError('Cannot unzip an iterable that does not yield an array');
	});

	it('given iterable with arrays of different sizes then throws an error', () => {
		const iterable = [
			[1, 'a'],
			[2, 'b', true],
			[3, 'c'],
		];
		expect(() => unzip(iterable)).toThrowError('Cannot unzip an iterable that yields arrays of different sizes');
	});
});
