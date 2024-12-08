import { windows } from '../src/lib/windows.ts';

describe('windows', () => {
	it('given iterable and limit greater than iterable length then returns an empty iterable', () => {
		const iterable = [1, 2, 3];
		const limit = 5;
		const result = [...windows(iterable, limit)];
		expect(result).toEqual([]);
	});

	it('given iterable and limit equal to iterable length then returns an array with the contents of the iterable', () => {
		const iterable = [1, 2, 3];
		const limit = 3;
		const result = [...windows(iterable, limit)];
		expect(result).toEqual([[1, 2, 3]]);
	});

	it('given iterable and limit less than iterable length then returns multiple windows', () => {
		const iterable = [1, 2, 3];
		const limit = 2;
		const result = [...windows(iterable, limit)];
		expect(result).toEqual([
			[1, 2],
			[2, 3],
		]);
	});

	it('given empty iterable then returns empty iterable', () => {
		const iterable: number[] = [];
		const limit = 5;
		const result = [...windows(iterable, limit)];
		expect(result).toEqual([]);
	});

	it('given iterable and limit equal to 0 then throws RangeError', () => {
		const iterable = [1, 2, 3];
		const limit = 0;
		expect(() => windows(iterable, limit)).toThrowError(new RangeError('0 must be a positive number'));
	});

	it('given iterable and limit less than 0 then throws RangeError', () => {
		const iterable = [1, 2, 3];
		const limit = -1;
		expect(() => windows(iterable, limit)).toThrowError(new RangeError('-1 must be a positive number'));
	});
});
