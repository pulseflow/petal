import { isNullOrUndefinedOrZero } from '../src';

describe('isNullOrUndefinedOrZero', () => {
	it('given empty string then returns false', () => {
		expect(isNullOrUndefinedOrZero('')).toBe(false);
	});

	it('given number as 0 then returns true', () => {
		expect(isNullOrUndefinedOrZero(0)).toBe(true);
	});

	it('given number then returns false', () => {
		expect(isNullOrUndefinedOrZero(5)).toBe(false);
	});

	it('given boolean then returns false', () => {
		expect(isNullOrUndefinedOrZero(true)).toBe(false);
	});

	it('given undefined then returns true', () => {
		expect(isNullOrUndefinedOrZero(undefined)).toBe(true);
	});

	it('given null then returns true', () => {
		expect(isNullOrUndefinedOrZero(null)).toBe(true);
	});

	it('given object then returns false', () => {
		expect(isNullOrUndefinedOrZero({})).toBe(false);
	});

	it('given array then returns false', () => {
		expect(isNullOrUndefinedOrZero([])).toBe(false);
	});

	it('given function then returns false', () => {
		const value = function value(): void {
			/* noop */
		};
		expect(isNullOrUndefinedOrZero(value)).toBe(false);
	});

	it('given array function then returns false', () => {
		const value = (): void => {
			/* noop */
		};
		expect(isNullOrUndefinedOrZero(value)).toBe(false);
	});

	it('given class then returns false', () => {
		const value = class A {};
		expect(isNullOrUndefinedOrZero(value)).toBe(false);
	});
});
