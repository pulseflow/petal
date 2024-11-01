import { isPrimitive } from '../src';

describe('isPrimitive', () => {
	it('given string then returns false', () => {
		const value = 'Hello World';
		expect(isPrimitive(value)).toBe(true);
	});

	it('given number then returns false', () => {
		const value = 420;
		expect(isPrimitive(value)).toBe(true);
	});

	it('given bigint then returns false', () => {
		const value = BigInt(420);
		expect(isPrimitive(value)).toBe(true);
	});

	it('given boolean then returns false', () => {
		const value = true;
		expect(isPrimitive(value)).toBe(true);
	});

	it('given undefined then returns false', () => {
		const value = undefined;
		expect(isPrimitive(value)).toBe(false);
	});

	it('given object then returns false', () => {
		const value = { class: '' };
		expect(isPrimitive(value)).toBe(false);
	});

	it('given object-null then returns false', () => {
		const value = null;
		expect(isPrimitive(value)).toBe(false);
	});

	it('given function then returns false', () => {
		const value = function value(): void {
			/* noop */
		};
		expect(isPrimitive(value)).toBe(false);
	});

	it('given arrow then returns false', () => {
		const value = (): void => {
			/* noop */
		};
		expect(isPrimitive(value)).toBe(false);
	});

	it('given class then returns false', () => {
		const value = class A {};
		expect(isPrimitive(value)).toBe(false);
	});
});
