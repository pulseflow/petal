import { compress } from '../src';

describe('compress', () => {
	it('given iterable and selectors of the same length then returns compressed iterable', () => {
		const iterable = [1, 2, 3, 4, 5];
		const selectors = [true, false, true, false, true];
		const result = [...compress(iterable, selectors)];
		expect(result).toEqual([1, 3, 5]);
	});

	it('given iterable and selectors with different lengths then returns compressed iterable up to the shortest length', () => {
		const iterable = [1, 2, 3, 4, 5];
		const selectors = [true, false];
		const result = [...compress(iterable, selectors)];
		expect(result).toEqual([1]);
	});

	it('given empty iterable then returns empty iterable', () => {
		const iterable: number[] = [];
		const selectors = [true, false, true];
		const result = [...compress(iterable, selectors)];
		expect(result).toEqual([]);
	});

	it('given empty selectors then returns empty iterable', () => {
		const iterable = [1, 2, 3];
		const selectors: boolean[] = [];
		const result = [...compress(iterable, selectors)];
		expect(result).toEqual([]);
	});
});
