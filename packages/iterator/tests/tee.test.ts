import { tee } from '../src';

describe('tee', () => {
	it('given iterable and count then returns an array of iterables', () => {
		const iterable = [1, 2, 3];
		const count = 3;
		const result = tee(iterable, count);
		expect(result).toHaveLength(count);
		expect([...result[0]]).toEqual([1, 2, 3]);
		expect([...result[1]]).toEqual([1, 2, 3]);
		expect([...result[2]]).toEqual([1, 2, 3]);
	});

	it('given iterable and count of 0 then returns an empty array', () => {
		const iterable = [1, 2, 3];
		const count = 0;
		const result = tee(iterable, count);
		expect(result).toEqual([]);
	});

	it('given empty iterable and count then returns an array of empty iterables', () => {
		const iterable: number[] = [];
		const count = 3;
		const result = tee(iterable, count);
		expect(result).toHaveLength(count);
		expect([...result[0]]).toEqual([]);
		expect([...result[1]]).toEqual([]);
		expect([...result[2]]).toEqual([]);
	});

	it('given iterable and count greater than iterable length then returns an array of iterables with undefined values', () => {
		const iterable = [1, 2, 3];
		const count = 5;
		const result = tee(iterable, count);
		expect(result).toHaveLength(count);
		expect([...result[0]]).toEqual([1, 2, 3]);
		expect([...result[1]]).toEqual([1, 2, 3]);
		expect([...result[2]]).toEqual([1, 2, 3]);
		expect([...result[3]]).toEqual([1, 2, 3]);
		expect([...result[4]]).toEqual([1, 2, 3]);
	});
});
