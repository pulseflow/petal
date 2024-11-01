import { slice } from '../src';

describe('slice', () => {
	it('given iterable then returns full iterable', () => {
		const iterable = [1, 2, 3, 4, 5];
		const result = [...slice(iterable)];
		expect(result).toEqual([1, 2, 3, 4, 5]);
	});

	it('given iterable and start index then returns sliced iterable from start index to end', () => {
		const iterable = [1, 2, 3, 4, 5];
		const result = [...slice(iterable, 2)];
		expect(result).toEqual([3, 4, 5]);
	});

	it('given iterable and negative infinity start index then returns full iterable', () => {
		const iterable = [1, 2, 3, 4, 5];
		const result = [...slice(iterable, Number.NEGATIVE_INFINITY)];
		expect(result).toEqual([1, 2, 3, 4, 5]);
	});

	it('given iterable and positive infinity start index then returns full iterable', () => {
		const iterable = [1, 2, 3, 4, 5];
		const result = [...slice(iterable, Number.POSITIVE_INFINITY)];
		expect(result).toEqual([]);
	});

	it('given iterable, start index, and end index then returns sliced iterable from start index to end index', () => {
		const iterable = [1, 2, 3, 4, 5];
		const result = [...slice(iterable, 1, 4)];
		expect(result).toEqual([2, 3, 4]);
	});

	it('given iterable, bigger positive start index than end index then returns empty iterable', () => {
		const iterable = [1, 2, 3, 4, 5];
		const result = [...slice(iterable, 4, 1)];
		expect(result).toEqual([]);
	});

	it('given iterable, zero start index, and negative end index then returns sliced iterable from start to end index', () => {
		const iterable = [1, 2, 3, 4, 5];
		const result = [...slice(iterable, 0, -1)];
		expect(result).toEqual([1, 2, 3, 4]);
	});

	it('given iterable, start index, and negative end index then returns sliced iterable from start to end index', () => {
		const iterable = [1, 2, 3, 4, 5];
		const result = [...slice(iterable, 1, -1)];
		expect(result).toEqual([2, 3, 4]);
	});

	it('given iterable, start index, and negative infinity end index then returns sliced iterable from start to end index', () => {
		const iterable = [1, 2, 3, 4, 5];
		const result = [...slice(iterable, 1, Number.NEGATIVE_INFINITY)];
		expect(result).toEqual([]);
	});

	it('given iterable, zero start index, and positive infinity end index then returns sliced iterable from start to end index', () => {
		const iterable = [1, 2, 3, 4, 5];
		const result = [...slice(iterable, 0, Number.POSITIVE_INFINITY)];
		expect(result).toEqual([1, 2, 3, 4, 5]);
	});

	it('given iterable, start index, and positive infinity end index then returns sliced iterable from start to end index', () => {
		const iterable = [1, 2, 3, 4, 5];
		const result = [...slice(iterable, 1, Number.POSITIVE_INFINITY)];
		expect(result).toEqual([2, 3, 4, 5]);
	});

	it('given iterable and negative start index then returns sliced iterable from end index to end', () => {
		const iterable = [1, 2, 3, 4, 5];
		const result = [...slice(iterable, -3)];
		expect(result).toEqual([3, 4, 5]);
	});

	it('given iterable, negative start index, and negative end index then returns sliced iterable from end index to end index', () => {
		const iterable = [1, 2, 3, 4, 5];
		const result = [...slice(iterable, -4, -1)];
		expect(result).toEqual([2, 3, 4]);
	});

	it('given iterable, bigger negative start index than negative end index then returns sliced iterable from end index to end index', () => {
		const iterable = [1, 2, 3, 4, 5];
		const result = [...slice(iterable, -1, -4)];
		expect(result).toEqual([]);
	});

	it('given empty iterable then returns empty iterable', () => {
		const iterable: number[] = [];
		const result = [...slice(iterable)];
		expect(result).toEqual([]);
	});
});
