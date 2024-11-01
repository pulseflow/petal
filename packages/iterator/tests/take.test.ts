import { take } from '../src';

describe('take', () => {
	it('given iterable and limit greater than iterable length then returns entire iterable', () => {
		const iterable = [1, 2, 3];
		const limit = 5;
		const result = [...take(iterable, limit)];
		expect(result).toEqual([1, 2, 3]);
	});

	it('given iterable and limit equal to iterable length then returns entire iterable', () => {
		const iterable = [1, 2, 3];
		const limit = 3;
		const result = [...take(iterable, limit)];
		expect(result).toEqual([1, 2, 3]);
	});

	it('given iterable and limit less than iterable length then returns limited iterable', () => {
		const iterable = [1, 2, 3];
		const limit = 2;
		const result = [...take(iterable, limit)];
		expect(result).toEqual([1, 2]);
	});

	it('given empty iterable then returns empty iterable', () => {
		const iterable: number[] = [];
		const limit = 5;
		const result = [...take(iterable, limit)];
		expect(result).toEqual([]);
	});

	it('given iterable and limit equal to 0 then returns empty iterable', () => {
		const iterable = [1, 2, 3];
		const limit = 0;
		const result = [...take(iterable, limit)];
		expect(result).toEqual([]);
	});

	it('given iterable and limit less than 0 then throws RangeError', () => {
		const iterable = [1, 2, 3];
		const limit = -1;
		expect(() => take(iterable, limit)).toThrowError(new RangeError('-1 must be a non-negative number'));
	});
});
