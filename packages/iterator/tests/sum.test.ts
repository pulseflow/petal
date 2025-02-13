import { sum } from '../src';

describe('sum', () => {
	it('given iterable of numbers then returns the sum of all numbers', () => {
		const iterable = [1, 2, 3, 4, 5];
		const result = sum(iterable);
		expect(result).toEqual(15);
	});

	it('given empty iterable then returns 0', () => {
		const iterable: number[] = [];
		const result = sum(iterable);
		expect(result).toEqual(0);
	});

	it('given iterable with negative numbers then returns the sum of all numbers', () => {
		const iterable = [-1, -2, -3, -4, -5];
		const result = sum(iterable);
		expect(result).toEqual(-15);
	});

	it('given iterable of booleans then returns true count', () => {
		const iterable = [true, true, false, true];
		const result = sum(iterable);
		expect(result).toEqual(3);
	});

	it('given iterable with strings then throws RangeError', () => {
		const iterable = ['a', 'e', 'c', 'b', 'd'];
		// @ts-expect-error: Testing invalid input
		expect(() => sum(iterable)).toThrow(new RangeError('a must be a non-NaN number'));
	});

	it('given iterable with NaN then throws RangeError', () => {
		const iterable = [1, 2, 3, Number.NaN, 5];
		expect(() => sum(iterable)).toThrow(new RangeError('NaN must be a non-NaN number'));
	});

	it('given iterable with bigints then throws TypeError', () => {
		const iterable = [1n, 2n, 3n, 4n, 5n];
		// @ts-expect-error: Testing invalid input
		expect(() => sum(iterable)).toThrow(new TypeError('Cannot convert a BigInt value to a number'));
	});

	it('given iterable with symbols then throws TypeError', () => {
		const iterable = [Symbol('a'), Symbol('b'), Symbol('c')];
		// @ts-expect-error: Testing invalid input
		expect(() => sum(iterable)).toThrow(new TypeError('Cannot convert a Symbol value to a number'));
	});

	it('given iterable with objects then throws RangeError', () => {
		const iterable = [{ foo: 'bar' }, { hello: 'world' }, { bax: 'qux' }];
		// @ts-expect-error: Testing invalid input
		expect(() => sum(iterable)).toThrow(new RangeError('[object Object] must be a non-NaN number'));
	});

	it('given objects with valueOf method then returns the sum of all numbers', () => {
		const iterable = [{ valueOf: () => 1 }, { valueOf: () => 2 }, { valueOf: () => 3 }];
		const result = sum(iterable);
		expect(result).toEqual(6);
	});

	it('given iterable with null then throws TypeError', () => {
		const iterable = [1, 2, 3, null, 5];
		const result = sum(iterable);
		expect(result).toEqual(11);
	});

	it('given iterable with undefined then throws TypeError', () => {
		const iterable = [1, 2, 3, undefined, 5];
		// @ts-expect-error: Testing invalid input
		expect(() => sum(iterable)).toThrow(new TypeError('Cannot convert an undefined value to a number'));
	});
});
