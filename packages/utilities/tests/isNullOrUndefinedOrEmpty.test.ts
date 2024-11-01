import { isNullOrUndefinedOrEmpty } from '../src';

describe('isNullOrUndefinedOrEmpty', () => {
	it('given empty string then returns true', () => {
		expect(isNullOrUndefinedOrEmpty('')).toBe(true);
	});

	it('given string then returns false', () => {
		expect(isNullOrUndefinedOrEmpty('test')).toBe(false);
	});

	it('given number then returns false', () => {
		expect(isNullOrUndefinedOrEmpty(5)).toBe(false);
	});

	it('given boolean then returns false', () => {
		expect(isNullOrUndefinedOrEmpty(true)).toBe(false);
	});

	it('given undefined then returns true', () => {
		expect(isNullOrUndefinedOrEmpty(undefined)).toBe(true);
	});

	it('given null then returns true', () => {
		expect(isNullOrUndefinedOrEmpty(null)).toBe(true);
	});

	it('given object then returns false', () => {
		expect(isNullOrUndefinedOrEmpty({})).toBe(false);
	});

	it('given array then returns true', () => {
		expect(isNullOrUndefinedOrEmpty([])).toBe(true);
	});

	it('given non-empty array then returns false', () => {
		expect(isNullOrUndefinedOrEmpty(['some non-empty array'])).toBe(false);
	});

	it('given function then returns true', () => {
		const value = function value(): void {
			/* noop */
		};
		expect(isNullOrUndefinedOrEmpty(value)).toBe(true);
	});

	it('given array function then returns true', () => {
		const value = (): void => {
			/* noop */
		};
		expect(isNullOrUndefinedOrEmpty(value)).toBe(true);
	});

	it('given class then returns true', () => {
		const value = class A {};
		expect(isNullOrUndefinedOrEmpty(value)).toBe(true);
	});
});
