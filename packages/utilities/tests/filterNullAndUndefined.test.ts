import { filterNullAndUndefined } from '../src';

describe('filterNullAndUndefined', () => {
	it('given empty array then returns same array', () => {
		const inputArray: unknown[] = [];
		expect(inputArray.filter(filterNullAndUndefined)).toStrictEqual(inputArray);
	});

	it('given array of strings then returns same array', () => {
		const inputArray = ['', 'one', 'two'];
		expect(inputArray.filter(filterNullAndUndefined)).toStrictEqual(inputArray);
	});

	it('given array of numbers then returns same array', () => {
		const inputArray = [0, 1, 2];
		expect(inputArray.filter(filterNullAndUndefined)).toStrictEqual(inputArray);
	});

	it('given array of booleans then returns same array', () => {
		const inputArray = [false, true];
		expect(inputArray.filter(filterNullAndUndefined)).toStrictEqual(inputArray);
	});

	it('given array of objects then returns same array', () => {
		const inputArray = [{ key: 'value' }, { key: 'value2' }];
		expect(inputArray.filter(filterNullAndUndefined)).toStrictEqual(inputArray);
	});

	it('given array with undefined then returns array without undefined', () => {
		const inputArray = [undefined, true, false];
		expect(inputArray.filter(filterNullAndUndefined)).toStrictEqual([true, false]);
	});

	it('given array with null then returns array without null', () => {
		const inputArray = [null, 1, 2];
		expect(inputArray.filter(filterNullAndUndefined)).toStrictEqual([1, 2]);
	});

	it('given string then returns true', () => {
		expect(filterNullAndUndefined('string')).toBe(true);
	});

	it('given number then returns true', () => {
		expect(filterNullAndUndefined(5)).toBe(true);
	});

	it('given boolean then returns true', () => {
		expect(filterNullAndUndefined(true)).toBe(true);
	});

	it('given undefined then returns false', () => {
		expect(filterNullAndUndefined(undefined)).toBe(false);
	});

	it('given null then returns false', () => {
		expect(filterNullAndUndefined(null)).toBe(false);
	});

	it('given empty object then returns true', () => {
		expect(filterNullAndUndefined({})).toBe(true);
	});

	it('given empty array then returns true', () => {
		expect(filterNullAndUndefined([])).toBe(true);
	});

	it('given empty function then returns true', () => {
		const value = function value(): void {
			/* noop */
		};
		expect(filterNullAndUndefined(value)).toBe(true);
	});

	it('given empty array function then returns true', () => {
		const value = (): void => {
			/* noop */
		};
		expect(filterNullAndUndefined(value)).toBe(true);
	});

	it('given empty class then returns true', () => {
		const value = class A {};
		expect(filterNullAndUndefined(value)).toBe(true);
	});
});
