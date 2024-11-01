import { isFunction, isPromise } from '../src/lib/utils';

describe('utils', () => {
	describe('isFunction', () => {
		it('given a function then returns true', () => {
			const fn = vi.fn();

			expect(isFunction(fn)).toBe(true);
			expect(fn).not.toHaveBeenCalled();
		});

		it.each([null, undefined, 42, 'Hello World', {}])('given %j then returns false', (value) => {
			expect(isFunction(value)).toBe(false);
		});
	});

	describe('isPromise', () => {
		it('given a promise then returns true', () => {
			const value = Promise.resolve(42);

			expect(isPromise(value)).toBe(true);
		});

		it('given a rejecting promise then returns true', () => {
			const value = Promise.reject(new Error('throws'));

			expect(isPromise(value)).toBe(true);

			void value.catch(vi.fn());
		});

		it('given a promise-like then returns true', () => {
			const cb = vi.fn();
			const value = { then: cb };

			expect(isPromise(value)).toBe(true);
			expect(cb).not.toHaveBeenCalled();
		});

		it.each([null, undefined, 42, 'Hello World', {}])('given %j then returns false', (value) => {
			expect(isPromise(value)).toBe(false);
		});
	});
});
