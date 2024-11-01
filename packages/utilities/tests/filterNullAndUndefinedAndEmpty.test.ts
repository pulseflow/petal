import { filterNullAndUndefinedAndEmpty } from '../src';

describe('filterNullAndUndefinedAndEmpty', () => {
	it('given empty array then returns same array', () => {
		const inputArray: unknown[] = [];
		expect(inputArray.filter(filterNullAndUndefinedAndEmpty)).toStrictEqual(inputArray);
	});

	it('given array of strings then returns same array', () => {
		const inputArray = ['', 'one', 'two'];
		expect(inputArray.filter(filterNullAndUndefinedAndEmpty)).toStrictEqual(['one', 'two']);
	});

	it('given array of numbers then returns same array', () => {
		const inputArray = [0, 1, 2];
		expect(inputArray.filter(filterNullAndUndefinedAndEmpty)).toStrictEqual(inputArray);
	});

	it('given array of booleans then returns same array', () => {
		const inputArray = [false, true];
		expect(inputArray.filter(filterNullAndUndefinedAndEmpty)).toStrictEqual(inputArray);
	});

	it('given array of objects then returns same array', () => {
		const inputArray = [{ key: 'value' }, { key: 'value2' }];
		expect(inputArray.filter(filterNullAndUndefinedAndEmpty)).toStrictEqual(inputArray);
	});

	it('given array with undefined then returns array without undefined', () => {
		const inputArray = [undefined, true, false];
		expect(inputArray.filter(filterNullAndUndefinedAndEmpty)).toStrictEqual([true, false]);
	});

	it('given array with null then returns array without null', () => {
		const inputArray = [null, 1, 2];
		expect(inputArray.filter(filterNullAndUndefinedAndEmpty)).toStrictEqual([1, 2]);
	});

	it('given empty string then returns false', () => {
		expect(filterNullAndUndefinedAndEmpty('')).toBe(false);
	});

	it('given string then returns true', () => {
		expect(filterNullAndUndefinedAndEmpty('test')).toBe(true);
	});

	it('given number as 0 then returns true', () => {
		expect(filterNullAndUndefinedAndEmpty(0)).toBe(true);
	});

	it('given number then returns true', () => {
		expect(filterNullAndUndefinedAndEmpty(5)).toBe(true);
	});

	it('given boolean then returns true', () => {
		expect(filterNullAndUndefinedAndEmpty(true)).toBe(true);
	});

	it('given undefined then returns false', () => {
		expect(filterNullAndUndefinedAndEmpty(undefined)).toBe(false);
	});

	it('given null then returns false', () => {
		expect(filterNullAndUndefinedAndEmpty(null)).toBe(false);
	});

	it('given object then returns true', () => {
		expect(filterNullAndUndefinedAndEmpty({})).toBe(true);
	});

	it('given array then returns false', () => {
		expect(filterNullAndUndefinedAndEmpty([])).toBe(false);
	});

	it('given non-empty array then returns true', () => {
		expect(filterNullAndUndefinedAndEmpty(['non-empty array'])).toBe(true);
	});

	it('given function then returns false', () => {
		const value = function value(): void {
			/* noop */
		};
		expect(filterNullAndUndefinedAndEmpty(value)).toBe(false);
	});

	it('given array function then returns false', () => {
		const value = (): void => {
			/* noop */
		};
		expect(filterNullAndUndefinedAndEmpty(value)).toBe(false);
	});

	it('given class then returns false', () => {
		const value = class A {};
		expect(filterNullAndUndefinedAndEmpty(value)).toBe(false);
	});
});
