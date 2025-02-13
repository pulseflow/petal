import { chunk } from '../src/lib/chunk.ts';

describe('chunk', () => {
	it('given iterable and chunk size then returns iterable of chunks', () => {
		const iterable = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		const chunkSize = 3;
		const result = [...chunk(iterable, chunkSize)];
		expect(result).toEqual([
			[1, 2, 3],
			[4, 5, 6],
			[7, 8, 9],
		]);
	});

	it('given iterable and chunk size greater than length then returns iterable with single chunk', () => {
		const iterable = [1, 2, 3];
		const chunkSize = 10;
		const result = [...chunk(iterable, chunkSize)];
		expect(result).toEqual([[1, 2, 3]]);
	});

	it('given empty iterable then returns empty iterable', () => {
		const iterable: number[] = [];
		const chunkSize = 3;
		const result = [...chunk(iterable, chunkSize)];
		expect(result).toEqual([]);
	});

	it('given iterable and chunk size zero then throws RangeError', () => {
		const iterable = [1, 2, 3];
		const chunkSize = 0;
		expect(() => [...chunk(iterable, chunkSize)]).toThrowError(new RangeError('0 must be a positive number'));
	});

	it('given iterable and negative chunk size then throws RangeError', () => {
		const iterable = [1, 2, 3];
		const chunkSize = -1;
		expect(() => [...chunk(iterable, chunkSize)]).toThrowError(new RangeError('-1 must be a positive number'));
	});

	it('given iterable and NaN chunk size then throws RangeError', () => {
		const iterable = [1, 2, 3];
		const chunkSize = Number.NaN;
		expect(() => [...chunk(iterable, chunkSize)]).toThrowError(new RangeError('NaN must be a non-NaN number'));
	});

	it('given iterable and Infinity chunk size then throws RangeError', () => {
		const iterable = [1, 2, 3];
		const chunkSize = Number.POSITIVE_INFINITY;
		expect(() => [...chunk(iterable, chunkSize)]).toThrowError(new RangeError('+Infinity cannot be represented as an integer'));
	});

	it('given iterable and -Infinity chunk size then throws RangeError', () => {
		const iterable = [1, 2, 3];
		const chunkSize = Number.NEGATIVE_INFINITY;
		expect(() => [...chunk(iterable, chunkSize)]).toThrowError(new RangeError('-Infinity cannot be represented as an integer'));
	});
});
