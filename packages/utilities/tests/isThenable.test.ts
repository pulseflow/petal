import { isThenable } from '../src';

describe('isThenable', () => {
	it('given string then returns false', () => {
		const value = 'Hello World';
		expect(isThenable(value)).toBe(false);
	});

	it('given number then returns false', () => {
		const value = 420;
		expect(isThenable(value)).toBe(false);
	});

	it('given bigint then returns false', () => {
		const value = BigInt(420);
		expect(isThenable(value)).toBe(false);
	});

	it('given boolean then returns false', () => {
		const value = true;
		expect(isThenable(value)).toBe(false);
	});

	it('given undefined then returns false', () => {
		const value = undefined;
		expect(isThenable(value)).toBe(false);
	});

	it('given object then returns false', () => {
		const value = { class: '' };
		expect(isThenable(value)).toBe(false);
	});

	it('given null then returns false', () => {
		const value = null;
		expect(isThenable(value)).toBe(false);
	});

	it('given promise-constructor then returns true', () => {
		const value = new Promise((resolve): void => resolve(true));
		expect(isThenable(value)).toBe(true);
	});

	it('given promise-resolve then returns true', () => {
		const value = Promise.resolve(true);
		expect(isThenable(value)).toBe(true);
	});

	it('given promise-like then returns true', () => {
		const value = {
			catch(): void {
				/* noop */
			},
			then(): boolean {
				return true;
			},
		};
		expect(isThenable(value)).toBe(true);
	});

	it('given function then returns false', () => {
		const value = function value(): void {
			/* noop */
		};
		expect(isThenable(value)).toBe(false);
	});

	it('given arrow then returns false', () => {
		const value = (): void => {
			/* noop */
		};
		expect(isThenable(value)).toBe(false);
	});

	it('given class then returns false', () => {
		const value = class A {};
		expect(isThenable(value)).toBe(false);
	});
});
