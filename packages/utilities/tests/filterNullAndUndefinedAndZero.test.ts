import { filterNullAndUndefinedAndZero } from '../src';

describe('filterNullAndUndefinedAndZero', () => {
	it('given empty array then returns same array', () => {
		const inputArray: unknown[] = [];
		expect(inputArray.filter(filterNullAndUndefinedAndZero)).toStrictEqual(inputArray);
	});

	it('given array of strings then returns same array', () => {
		const inputArray = ['', 'one', 'two'];
		expect(inputArray.filter(filterNullAndUndefinedAndZero)).toStrictEqual(inputArray);
	});

	it('given array of numbers then returns same array', () => {
		const inputArray = [0, 1, 2];
		expect(inputArray.filter(filterNullAndUndefinedAndZero)).toStrictEqual([1, 2]);
	});

	it('given array of booleans then returns same array', () => {
		const inputArray = [false, true];
		expect(inputArray.filter(filterNullAndUndefinedAndZero)).toStrictEqual(inputArray);
	});

	it('given array of objects then returns same array', () => {
		const inputArray = [{ key: 'value' }, { key: 'value2' }];
		expect(inputArray.filter(filterNullAndUndefinedAndZero)).toStrictEqual(inputArray);
	});

	it('given array with undefined then returns array without undefined', () => {
		const inputArray = [undefined, true, false];
		expect(inputArray.filter(filterNullAndUndefinedAndZero)).toStrictEqual([true, false]);
	});

	it('given array with null then returns array without null', () => {
		const inputArray = [null, 1, 2];
		expect(inputArray.filter(filterNullAndUndefinedAndZero)).toStrictEqual([1, 2]);
	});

	it('given string then returns true', () => {
		expect(filterNullAndUndefinedAndZero('')).toBe(true);
	});

	it('given number as 0 then returns false', () => {
		expect(filterNullAndUndefinedAndZero(0)).toBe(false);
	});

	it('given number then returns true', () => {
		expect(filterNullAndUndefinedAndZero(5)).toBe(true);
	});

	it('given boolean then returns true', () => {
		expect(filterNullAndUndefinedAndZero(true)).toBe(true);
	});

	it('given undefined then returns false', () => {
		expect(filterNullAndUndefinedAndZero(undefined)).toBe(false);
	});

	it('given null then returns false', () => {
		expect(filterNullAndUndefinedAndZero(null)).toBe(false);
	});

	it('given object then returns true', () => {
		expect(filterNullAndUndefinedAndZero({})).toBe(true);
	});

	it('given array then returns true', () => {
		expect(filterNullAndUndefinedAndZero([])).toBe(true);
	});

	it('given function then returns true', () => {
		const value = function value(): void {
			/* noop */
		};
		expect(filterNullAndUndefinedAndZero(value)).toBe(true);
	});

	it('given array function then returns true', () => {
		const value = (): void => {
			/* noop */
		};
		expect(filterNullAndUndefinedAndZero(value)).toBe(true);
	});

	it('given class then returns true', () => {
		const value = class A {};
		expect(filterNullAndUndefinedAndZero(value)).toBe(true);
	});
});
