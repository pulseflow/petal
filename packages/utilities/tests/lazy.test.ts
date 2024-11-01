import { lazy } from '../src';

describe('lazy', () => {
	it('given string callback then returns the same', () => {
		const callback = vi.fn(() => 'Lorem Ipsum');

		const lazyStoredValue = lazy(callback);

		expect(lazyStoredValue()).toEqual('Lorem Ipsum');
	});

	it('given string callback with cached value then returns the same', () => {
		const callback = vi.fn(() => 'Lorem Ipsum');

		const lazyStoredValue = lazy(callback);

		lazyStoredValue();
		const cachedValue = lazyStoredValue();

		expect(callback).toHaveBeenCalledOnce();
		expect(cachedValue).toEqual('Lorem Ipsum');
	});
});
