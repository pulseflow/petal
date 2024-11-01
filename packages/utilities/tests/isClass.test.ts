import { isClass } from '../src';

describe('isClass', () => {
	it('given string then returns false', () => {
		const value = 'Hello World';
		expect(isClass(value)).toBe(false);
	});

	it('given number then returns false', () => {
		const value = 420;
		expect(isClass(value)).toBe(false);
	});

	it('given BigInt then returns false', () => {
		const value = BigInt(420);
		expect(isClass(value)).toBe(false);
	});

	it('given boolean then returns false', () => {
		const value = true;
		expect(isClass(value)).toBe(false);
	});

	it('given undefined then returns false', () => {
		const value = undefined;
		expect(isClass(value)).toBe(false);
	});

	it('given object then returns false', () => {
		const value = { class: '' };
		expect(isClass(value)).toBe(false);
	});

	it('given null then returns false', () => {
		const value = null;
		expect(isClass(value)).toBe(false);
	});

	it('given function expression then returns true', () => {
		const value = function value(): void {
			/* noop */
		};
		expect(isClass(value)).toBe(true);
	});

	it('given array function then returns false', () => {
		const value = (): void => {
			/* noop */
		};
		expect(isClass(value)).toBe(false);
	});

	it('given class then returns true', () => {
		const value = class A {};
		expect(isClass(value)).toBe(true);
	});
});
