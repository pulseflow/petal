import { sleep } from '../src';

describe('sleep', () => {
	it('given a number of ms then resolve the promise after that time', async () => {
		vi.useFakeTimers({ advanceTimeDelta: 50, shouldAdvanceTime: true });
		const start = Date.now();
		const result = sleep(50);

		await expect<Promise<undefined>>(result).resolves.toBe(undefined);
		expect(Date.now() - start).toBe(50);
		vi.useRealTimers();
	});

	it('given a number of ms and a value then resolve the promise after that time with the value', async () => {
		vi.useFakeTimers({ advanceTimeDelta: 50, shouldAdvanceTime: true });
		const start = Date.now();
		const result = sleep(50, 'test');

		await expect<Promise<string>>(result).resolves.toBe('test');
		expect(Date.now() - start).toBe(50);
		vi.useRealTimers();
	});

	it('given an aborted signal then the promise rejects without a timeout', async () => {
		const signal = AbortSignal.abort();
		const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
		const promise = sleep(50, undefined, { signal });

		await expect(promise).rejects.toStrictEqual(new DOMException('This operation was aborted', 'AbortError'));
		expect(clearTimeoutSpy).toHaveBeenCalledTimes(0);
	});

	it('given an immediately aborted signal then the promise rejects', async () => {
		const controller = new AbortController();
		const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
		const promise = sleep(50, undefined, { signal: controller.signal });
		controller.abort();

		await expect(promise).rejects.toStrictEqual(new DOMException('This operation was aborted', 'AbortError'));
		expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
	});

	it('given an immediately aborted signal with a reason then reject the promise with the reason as cause', async () => {
		const controller = new AbortController();
		const promise = sleep(50, undefined, { signal: controller.signal });
		controller.abort('Too late!');
		await expect(promise).rejects.toStrictEqual('Too late!');
	});
});
