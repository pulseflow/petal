import { retry } from '../src';

describe('retry', () => {
	it('given a simple string return then returns the same on first attempt', async () => {
		const mockFunction = vi.fn().mockReturnValue('test');
		const result = await retry(mockFunction, 3);

		expect(result).toBe('test');
		expect(mockFunction).toBeCalledTimes(1);
	});

	it('given a twice failing function then returns the third result', async () => {
		const mockFunction = vi
			.fn()
			.mockRejectedValueOnce('💣💥')
			.mockRejectedValueOnce('💣💥')
			.mockReturnValueOnce('success!');

		const result = await retry(mockFunction, 3);

		expect(result).toBe('success!');
		expect(mockFunction).toBeCalledTimes(3);
	});

	it('given a thrice failing function WHEN retries is lower then returns throws the last error', async () => {
		const mockFunction = vi
			.fn()
			.mockRejectedValueOnce('💣💥')
			.mockRejectedValueOnce('💣💥')
			.mockRejectedValueOnce('💣💥');

		await expect(retry(mockFunction, 2)).rejects.toThrowError('💣💥');
		expect(mockFunction).toBeCalledTimes(2);
	});

	it('given 0 retries then returns result', async () => {
		const mockFunction = vi.fn().mockReturnValue('test');
		const result = await retry(mockFunction, 0);

		expect(result).toBe('test');
		expect(mockFunction).toBeCalledTimes(1);
	});

	it('given retries below 1 then throws', async () => {
		const mockFunction = vi.fn().mockReturnValue('test');
		await expect(retry(mockFunction, -1)).rejects.toThrowError(new RangeError('Expected retries to be a number >= 0'));
		expect(mockFunction).toBeCalledTimes(0);
	});
});
