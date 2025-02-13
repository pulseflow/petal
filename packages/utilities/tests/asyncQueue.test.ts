import type { AsyncQueueWaitOptions } from '../src/lib/asyncQueue';
import { AsyncQueue } from '../src/lib/asyncQueue';

function genNumbers(queue: AsyncQueue) {
	let i = 0;
	return async (options?: Readonly<AsyncQueueWaitOptions>): Promise<number> => {
		await queue.wait(options);
		try {
			return await Promise.resolve(++i);
		}
		finally {
			queue.shift();
		}
	};
}

describe('asyncQueue', () => {
	it('given await calls then increments after each', async () => {
		const queue = new AsyncQueue();
		const tester = genNumbers(queue);

		expect(await tester()).toBe(1);
		expect(await tester()).toBe(2);
	});

	it('given race condition then entries are executed in queue order', async () => {
		const queue = new AsyncQueue();
		const tester = genNumbers(queue);

		const first = tester();
		const second = tester();
		const third = tester();

		expect(await Promise.race([second, first, third])).toBe(1);
	});

	it('given multiple calls without await then none is resolved', () => {
		const queue = new AsyncQueue();
		const tester = genNumbers(queue);

		void tester();
		void tester();
		void tester();

		expect(queue.remaining).toBe(3);
	});

	it('given shifting an undefined queue then doesn\'t throw', () => {
		const queue = new AsyncQueue();

		expect(queue.remaining).toBe(0);
		expect(() => queue.shift()).not.toThrow();
	});

	it('given AbortSignal on empty queue then does not set an abort handler', async () => {
		const queue = new AsyncQueue();
		const tester = genNumbers(queue);

		const controller = new AbortController();
		const promise = tester({ signal: controller.signal });
		expect(queue.promises[0].signal).toBe(null);
		expect(queue.promises[0].signalListener).toBe(null);

		controller.abort();
		await expect(promise).resolves.toBe(1);
	});

	it('given non-head item with AbortSignal + abort() then rejects queued item and dequeues it', async () => {
		const queue = new AsyncQueue();
		const controller = new AbortController();
		const tester = genNumbers(queue);

		const first = tester();
		const second = tester({ signal: controller.signal });
		const third = tester();

		expect(queue.remaining).toBe(3);
		expect(queue.promises[1].signal).toBe(controller.signal);
		expect(queue.promises[1].signalListener).not.toBe(null);

		const thirdEntry = queue.promises[2];

		controller.abort();
		expect(queue.remaining).toBe(2);
		expect(queue.promises[1]).toBe(thirdEntry);

		await expect(first).resolves.toBe(1);
		expect(queue.remaining).toBe(0);

		await expect(second).rejects.toThrowError('Request aborted manually');
		await expect(third).resolves.toBe(2);
	});

	it('given non-head item with aborted AbortSignal then does not set an abort handler', async () => {
		const queue = new AsyncQueue();
		const controller = new AbortController();
		controller.abort();

		const tester = genNumbers(queue);

		const first = tester();
		const second = tester({ signal: controller.signal });
		expect(queue.remaining).toBe(2);
		expect(queue.promises[1].signal).toBe(null);
		expect(queue.promises[1].signalListener).toBe(null);

		await expect(first).resolves.toBe(1);
		await expect(second).resolves.toBe(2);
	});

	it('given non-head item with AbortSignal + late abort() then unregisters abort listener', async () => {
		const queue = new AsyncQueue();
		const controller = new AbortController();
		const tester = genNumbers(queue);

		const first = tester();
		const second = tester({ signal: controller.signal });
		expect(queue.remaining).toBe(2);

		await expect(first).resolves.toBe(1);

		controller.abort();
		await expect(second).resolves.toBe(2);
	});

	describe('abortAll', () => {
		it('given empty queue then does no operation', () => {
			const queue = new AsyncQueue();

			expect(() => queue.abortAll()).not.toThrow();
		});

		it('given queue with only the head then does no operation', async () => {
			const queue = new AsyncQueue();
			const tester = genNumbers(queue);

			const first = tester();
			const firstSpy = vi.spyOn(queue.promises[0], 'abort');

			expect(() => queue.abortAll()).not.toThrow();
			expect(firstSpy).not.toHaveBeenCalled();
			await expect(first).resolves.toBe(1);
		});

		it('given queue with several entries then aborts all non-head entries', async () => {
			const queue = new AsyncQueue();
			const tester = genNumbers(queue);

			const first = tester();
			const second = tester();
			const third = tester();

			const firstSpy = vi.spyOn(queue.promises[0], 'abort');
			const secondSpy = vi.spyOn(queue.promises[1], 'abort');
			const thirdSpy = vi.spyOn(queue.promises[2], 'abort');

			expect(() => queue.abortAll()).not.toThrow();
			expect(firstSpy).not.toHaveBeenCalled();
			expect(secondSpy).toHaveBeenCalledOnce();
			expect(thirdSpy).toHaveBeenCalledOnce();

			await expect(first).resolves.toBe(1);
			await expect(second).rejects.toThrowError('Request aborted manually');
			await expect(third).rejects.toThrowError('Request aborted manually');
		});
	});
});
