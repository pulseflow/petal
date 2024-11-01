import { isNumber } from '../src';

describe('isNumber', () => {
	it('given string then returns false', () => {
		const value = 'Hello World';
		expect(isNumber(value)).toBe(false);
	});

	it('given number-integer then returns false', () => {
		const value = 420;
		expect(isNumber(value)).toBe(true);
	});

	it('given number-float then returns false', () => {
		const value = -420.5;
		expect(isNumber(value)).toBe(true);
	});

	it('given number-nan then returns false', () => {
		const value = Number.NaN;
		expect(isNumber(value)).toBe(false);
	});

	it('given number-infinite then returns false', () => {
		const value = Infinity;
		expect(isNumber(value)).toBe(false);
	});

	it('given bigint then returns false', () => {
		const value = BigInt(420);
		expect(isNumber(value)).toBe(false);
	});

	it('given boolean then returns false', () => {
		const value = true;
		expect(isNumber(value)).toBe(false);
	});

	it('given undefined then returns false', () => {
		const value = undefined;
		expect(isNumber(value)).toBe(false);
	});

	it('given object then returns false', () => {
		const value = { class: '' };
		expect(isNumber(value)).toBe(false);
	});

	it('given object-null then returns false', () => {
		const value = null;
		expect(isNumber(value)).toBe(false);
	});

	it('given function then returns false', () => {
		const value = function value(): void {
			/* noop */
		};
		expect(isNumber(value)).toBe(false);
	});

	it('given arrow then returns false', () => {
		const value = (): void => {
			/* noop */
		};
		expect(isNumber(value)).toBe(false);
	});

	it('given class then returns false', () => {
		const value = class A {};
		expect(isNumber(value)).toBe(false);
	});
});
