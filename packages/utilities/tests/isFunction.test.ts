import { isFunction } from '../src';

describe('isFunction', () => {
	it('given string then returns false', () => {
		const value = 'Hello World';
		expect(isFunction(value)).toBe(false);
	});

	it('given number then returns false', () => {
		const value = 420;
		expect(isFunction(value)).toBe(false);
	});

	it('given BigInt then returns false', () => {
		const value = BigInt(420);
		expect(isFunction(value)).toBe(false);
	});

	it('given boolean then returns false', () => {
		const value = true;
		expect(isFunction(value)).toBe(false);
	});

	it('given undefined then returns false', () => {
		const value = undefined;
		expect(isFunction(value)).toBe(false);
	});

	it('given object then returns false', () => {
		const value = { class: '' };
		expect(isFunction(value)).toBe(false);
	});

	it('given null then returns false', () => {
		const value = null;
		expect(isFunction(value)).toBe(false);
	});

	it('given function expression then returns true', () => {
		const value = function value(): void {
			/* noop */
		};
		expect(isFunction(value)).toBe(true);
	});

	it('given arrow function then returns true', () => {
		const value = (): void => {
			/* noop */
		};
		expect(isFunction(value)).toBe(true);
	});

	it('given class then returns true', () => {
		const value = class A {};
		expect(isFunction(value)).toBe(true);
	});
});
