import { isObject } from '../src';

describe('isObject', () => {
	it('given string then returns false', () => {
		const value = 'Hello World';
		expect(isObject(value)).toBe(false);
	});

	it('given number then returns false', () => {
		const value = 420;
		expect(isObject(value)).toBe(false);
	});

	it('given bigint then returns false', () => {
		const value = BigInt(420);
		expect(isObject(value)).toBe(false);
	});

	it('given boolean then returns false', () => {
		const value = true;
		expect(isObject(value)).toBe(false);
	});

	it('given undefined then returns false', () => {
		const value = undefined;
		expect(isObject(value)).toBe(false);
	});

	it('given object then returns false', () => {
		const value = { class: '' };
		expect(isObject(value)).toBe(true);
	});

	it('given object-null then returns false', () => {
		const value = null;
		expect(isObject(value)).toBe(false);
	});

	it('given object-array then returns false', () => {
		const value: undefined[] = [];
		expect(isObject(value)).toBe(false);
	});

	it('given object-non-literal then returns false', () => {
		const value = new (class A {})();
		expect(isObject(value)).toBe(false);
	});

	it('given function then returns false', () => {
		const value = function value(): void {
			/* noop */
		};
		expect(isObject(value)).toBe(false);
	});

	it('given arrow then returns false', () => {
		const value = (): void => {
			/* noop */
		};
		expect(isObject(value)).toBe(false);
	});

	it('given class then returns false', () => {
		const value = class A {};
		expect(isObject(value)).toBe(false);
	});

	it('given instance of class then returns false', () => {
		class A {}
		const value = new A();

		expect(isObject(value)).toBe(false);
	});

	it('given instance of class WITH custom constructorType then returns true', () => {
		class A {
			public B!: string;
		}

		const value = new A();

		expect(isObject(value, A)).toBe(true);
	});
});
