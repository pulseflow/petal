import { retrySync } from '../src';

describe('retry', () => {
	it('given a simple string return then returns the same on first attempt', () => {
		const mockFunction = vi.fn().mockReturnValue('test');
		const result = retrySync(mockFunction, 3);

		expect(result).toBe('test');
		expect(mockFunction).toBeCalledTimes(1);
	});

	it('given a twice failing function then returns the third result', () => {
		let counter = 0;
		const cb = () => {
			if (counter < 2) {
				++counter;
				throw new Error('💣💥');
			}

			return 'success!';
		};
		const mockFunction = vi.fn(cb);

		const result = retrySync(mockFunction, 3);

		expect(result).toBe('success!');
		expect(counter).toBe(2);
		expect(mockFunction).toBeCalledTimes(3);
	});

	it('given a thrice failing function WHEN retries is lower then returns throws the last error', () => {
		let counter = 0;
		const cb = () => {
			if (counter < 2) {
				++counter;
				throw new Error('💣💥');
			}

			return 'success!';
		};
		const mockFunction = vi.fn().mockImplementation(cb);

		expect(() => retrySync(mockFunction, 2)).toThrowError(new Error('💣💥'));
		expect(counter).toBe(2);
		expect(mockFunction).toBeCalledTimes(2);
	});

	it('given 0 retries then returns result', () => {
		const mockFunction = vi.fn().mockReturnValue('test');
		const result = retrySync(mockFunction, 0);

		expect(result).toBe('test');
		expect(mockFunction).toBeCalledTimes(1);
	});

	it('given retries below 1 then throws', () => {
		const mockFunction = vi.fn().mockReturnValue('test');
		expect(() => retrySync(mockFunction, -1)).toThrowError(new RangeError('Expected retries to be a number >= 0'));
		expect(mockFunction).toBeCalledTimes(0);
	});
});
