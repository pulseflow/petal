import { isNullOrUndefined } from '../src';

describe('isNullOrUndefined', () => {
	it('given string then returns false', () => {
		expect(isNullOrUndefined('')).toBe(false);
	});

	it('given number then returns false', () => {
		expect(isNullOrUndefined(5)).toBe(false);
	});

	it('given boolean then returns false', () => {
		expect(isNullOrUndefined(true)).toBe(false);
	});

	it('given undefined then returns true', () => {
		expect(isNullOrUndefined(undefined)).toBe(true);
	});

	it('given null then returns true', () => {
		expect(isNullOrUndefined(null)).toBe(true);
	});

	it('given object then returns false', () => {
		expect(isNullOrUndefined({})).toBe(false);
	});

	it('given array then returns false', () => {
		expect(isNullOrUndefined([])).toBe(false);
	});

	it('given function then returns false', () => {
		const value = function value(): void {
			/* noop */
		};
		expect(isNullOrUndefined(value)).toBe(false);
	});

	it('given array function then returns false', () => {
		const value = (): void => {
			/* noop */
		};
		expect(isNullOrUndefined(value)).toBe(false);
	});

	it('given class then returns false', () => {
		const value = class A {};
		expect(isNullOrUndefined(value)).toBe(false);
	});
});
