import { poll } from '../src';

describe('poll', () => {
	const pass = 'success!';
	const fail = 'fail!';
	const cbRaw = () => pass;
	const cbConditionRaw = (result: string) => result === pass;

	it('given a poll with no retries then returns first attempt', async () => {
		const cb = vi.fn(() => pass);
		const cbCondition = vi.fn(cbConditionRaw);
		const result = poll(cb, cbCondition, { maximumRetries: 0 });

		await expect(result).resolves.toBe(pass);
		expect(cb).toBeCalledTimes(1);
		expect(cb).toHaveBeenCalledWith(undefined);
		expect(cbCondition).toBeCalledTimes(0);
	});

	it('given a function that fails twice then succeeds then calls that function thrice', async () => {
		const cb = vi
			.fn()
			.mockReturnValueOnce(fail)
			.mockReturnValueOnce(fail)
			.mockReturnValueOnce(pass);
		const cbCondition = vi.fn(cbConditionRaw);
		const result = poll(cb, cbCondition);

		await expect(result).resolves.toBe(pass);
		expect(cb).toBeCalledTimes(3);
		expect(cbCondition).toBeCalledTimes(3);
	});

	describe('signal', () => {
		it('given an AbortSignal that is aborted before the first call then throws', async () => {
			const cb = vi.fn(cbRaw);
			const cbCondition = vi.fn(cbConditionRaw);
			const result = poll(cb, cbCondition, { signal: AbortSignal.abort() });

			await expect(result).rejects.toStrictEqual(new DOMException('This operation was aborted', 'AbortError'));
			expect(cb).toBeCalledTimes(0);
			expect(cbCondition).toBeCalledTimes(0);
		});

		it('given an AbortSignal that is aborted in the condition then throws without retry', async () => {
			const controller = new AbortController();
			const cb = vi.fn(() => fail);
			const cbCondition = vi.fn((result: string) => {
				controller.abort();
				return result === pass;
			});
			const result = poll(cb, cbCondition, { signal: controller.signal });

			await expect(result).rejects.toStrictEqual(new DOMException('This operation was aborted', 'AbortError'));
			expect(cb).toBeCalledTimes(1);
			expect(cbCondition).toBeCalledTimes(1);
		});
	});

	describe('maximumRetries', () => {
		const cb = () => pass;

		it.each([undefined, null, 0, 5, Infinity])('given %j then passes validation', async (maximumRetries) => {
			const result = poll(cb, cbConditionRaw, { maximumRetries });
			await expect(result).resolves.toBe(pass);
		});

		it.each(['foo', true])('given %j then throws TypeError', async (maximumRetries) => {
			// @ts-expect-error: invalid type
			const result = poll(cb, cbConditionRaw, { maximumRetries });
			await expect(result).rejects.toStrictEqual(new TypeError('Expected maximumRetries to be a number'));
		});

		it.each([Number.NaN, -Number.NaN, -Infinity, -5])('given %j then throws RangeError', async (maximumRetries) => {
			const result = poll(cb, cbConditionRaw, { maximumRetries });
			await expect(result).rejects.toStrictEqual(new RangeError('Expected maximumRetries to be a non-negative number'));
		});

		it('given a poll with only one retry and fails both then calls that function twice, but condition only once', async () => {
			const cb = vi
				.fn()
				.mockReturnValueOnce(fail)
				.mockReturnValueOnce(fail);
			const cbCondition = vi.fn((result: string) => result === pass);
			const result = poll(cb, cbCondition, { maximumRetries: 1 });

			await expect(result).resolves.toBe(fail);
			expect(cb).toBeCalledTimes(2);
			expect(cbCondition).toBeCalledTimes(1);
		});

		it('given a poll with two retries and succeeds first then calls that function and condition once', async () => {
			const cb = vi.fn(() => pass);
			const cbCondition = vi.fn((result: string) => result === pass);
			const result = poll(cb, cbCondition, { maximumRetries: 2 });

			await expect(result).resolves.toBe(pass);
			expect(cb).toBeCalledTimes(1);
			expect(cbCondition).toBeCalledTimes(1);
		});
	});

	describe('waitBetweenRetries', () => {
		it.each([undefined, null, 0, 5])('given %j then passes validation', async (waitBetweenRetries) => {
			const cb = vi.fn(cbRaw);
			const cbCondition = vi.fn(cbConditionRaw);
			const result = poll(cb, cbCondition, { waitBetweenRetries });

			await expect(result).resolves.toBe(pass);
			expect(cb).toBeCalledTimes(1);
			expect(cbCondition).toBeCalledTimes(1);
		});

		it.each(['foo', true])('given %j then throws TypeError', async (waitBetweenRetries) => {
			const cb = vi.fn(cbRaw);
			const cbCondition = vi.fn(cbConditionRaw);
			const result = poll(cb, cbCondition, { waitBetweenRetries: waitBetweenRetries as unknown as number });

			await expect(result).rejects.toStrictEqual(new TypeError('Expected waitBetweenRetries to be a number'));
			expect(cb).toBeCalledTimes(0);
			expect(cbCondition).toBeCalledTimes(0);
		});

		it.each([Number.NaN, -Number.NaN, -Infinity, -5, Infinity, 5.5])('given %j then throws RangeError', async (waitBetweenRetries) => {
			const cb = vi.fn(cbRaw);
			const cbCondition = vi.fn(cbConditionRaw);
			const result = poll(cb, cbCondition, { waitBetweenRetries });

			await expect(result).rejects.toStrictEqual(new RangeError('Expected waitBetweenRetries to be a positive safe integer'));
			expect(cb).toBeCalledTimes(0);
			expect(cbCondition).toBeCalledTimes(0);
		});

		it('given a poll with a wait of 5ms then waits 5ms between retries', async () => {
			const cb = vi
				.fn()
				.mockReturnValueOnce(fail)
				.mockReturnValueOnce(pass);
			const cbCondition = vi.fn(cbConditionRaw);

			const timeout = vi.spyOn(globalThis, 'setTimeout').mockImplementationOnce((cb) => {
				cb();
				return 0 as unknown as NodeJS.Timeout;
			});
			const result = poll(cb, cbCondition, { waitBetweenRetries: 5 });
			await expect(result).resolves.toBe(pass);
			expect(timeout).toBeCalledTimes(1);
			expect(timeout.mock.calls[0][1]).toBe(5);
		});

		it('given a poll with a wait of 5ms then waits 5ms between retries (promise)', async () => {
			const cb = vi
				.fn()
				.mockReturnValueOnce(fail)
				.mockReturnValueOnce(pass);
			const cbCondition = vi.fn(cbConditionRaw);

			vi.useFakeTimers({ advanceTimeDelta: 5, shouldAdvanceTime: true });
			const signal = AbortSignal.timeout(5);
			const result = poll(cb, cbCondition, { signal, waitBetweenRetries: 10 });
			vi.useRealTimers();

			await expect(result).rejects.toStrictEqual(new DOMException('The operation was aborted due to timeout', 'TimeoutError'));
			expect(cb).toBeCalledTimes(1);
			expect(cb).toHaveBeenCalledWith(signal);
			expect(cbCondition).toBeCalledTimes(1);
			expect(cbCondition).toHaveBeenCalledWith(fail, signal);
		});
	});

	describe('verbose', () => {
		it('given verbose but no waitBetweenRetries then does not call console.log', async () => {
			const cb = vi.fn().mockReturnValueOnce(fail).mockReturnValueOnce(pass);
			const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => undefined);
			const result = poll(cb, cbConditionRaw, { verbose: true });

			await expect(result).resolves.toBe(pass);
			expect(consoleLog).toHaveBeenCalledTimes(0);
		});

		it('given verbose and waitBetweenRetries then calls console.log on retry', async () => {
			const cb = vi.fn().mockReturnValueOnce(fail).mockReturnValueOnce(pass);
			const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => undefined);
			const result = poll(cb, cbConditionRaw, { verbose: true, waitBetweenRetries: 5 });

			await expect(result).resolves.toBe(pass);
			expect(consoleLog).toHaveBeenCalledTimes(1);
			expect(consoleLog).toHaveBeenCalledWith('Waiting 5ms before polling again...');
		});
	});
});
