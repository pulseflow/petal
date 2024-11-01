export interface AsyncQueueWaitOptions {
	signal?: AbortSignal | undefined | null;
}

export class AsyncQueueEntry {
	public readonly promise: Promise<void>;
	public signal: PolyFillAbortSignal | null = null;
	public signalListener: (() => void) | null = null;
	private resolve!: () => void;
	private reject!: (error: Error) => void;
	private readonly queue: AsyncQueue;

	public constructor(queue: AsyncQueue) {
		this.queue = queue;
		this.promise = new Promise((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
		});
	}

	public setSignal(signal: AbortSignal): this {
		if (signal.aborted)
			return this;

		this.signal = signal as PolyFillAbortSignal;
		this.signalListener = () => {
			const index = this.queue.promises.indexOf(this);
			if (index !== -1)
				this.queue.promises.splice(index, 1);

			this.reject(new Error('Request aborted manually'));
		};
		this.signal.addEventListener('abort', this.signalListener);
		return this;
	}

	public use(): this {
		this.dispose();
		this.resolve();
		return this;
	}

	public abort(): this {
		this.dispose();
		this.reject(new Error('Request aborted manually'));
		return this;
	}

	private dispose(): void {
		if (this.signal) {
			this.signal.removeEventListener('abort', this.signalListener!);
			this.signal = null;
			this.signalListener = null;
		}
	}
}

interface PolyFillAbortSignal {
	readonly aborted: boolean;
	addEventListener: (type: 'abort', listener: () => void) => void;
	removeEventListener: (type: 'abort', listener: () => void) => void;
}

/**
 * The AsyncQueue class used to sequentialize burst requests
 */
export class AsyncQueue {
	/**
	 * The amount of entries in the queue, including the head.
	 * @seealso {@link queued} for the queued count.
	 */
	public get remaining(): number {
		return this.promises.length;
	}

	/**
	 * The amount of queued entries.
	 * @seealso {@link remaining} for the count with the head.
	 */
	public get queued(): number {
		return this.remaining === 0 ? 0 : this.remaining - 1;
	}

	/**
	 * The promises array
	 */
	public promises: AsyncQueueEntry[] = [];

	/**
	 * Waits for last promise and queues a new one
	 * @example
	 * ```typescript
	 * const queue = new AsyncQueue();
	 * async function request(url, options) {
	 * 	await queue.wait({ signal: options.signal });
	 * 	try {
	 * 		const result = await fetch(url, options);
	 * 		// Do some operations with 'result'
	 * 	} finally {
	 * 		// Remove first entry from the queue and resolve for the next entry
	 * 		queue.shift();
	 * 	}
	 * }
	 *
	 * request(someUrl1, someOptions1); // Will call fetch() immediately
	 * request(someUrl2, someOptions2); // Will call fetch() after the first finished
	 * request(someUrl3, someOptions3); // Will call fetch() after the second finished
	 * ```
	 */
	public async wait(options?: Readonly<AsyncQueueWaitOptions>): Promise<void> {
		const entry = new AsyncQueueEntry(this);

		if (this.promises.length === 0) {
			this.promises.push(entry);
			return Promise.resolve();
		}

		this.promises.push(entry);
		if (options?.signal)
			entry.setSignal(options.signal);
		return entry.promise;
	}

	/**
	 * Unlocks the head lock and transfers the next lock (if any) to the head.
	 */
	public shift(): void {
		if (this.promises.length === 0)
			return;
		if (this.promises.length === 1) {
			// Remove the head entry.
			this.promises.shift();
			return;
		}

		// Remove the head entry, making the 2nd entry the new one.
		// Then use the head entry, which will unlock the promise.
		this.promises.shift();
		this.promises[0].use();
	}

	/**
	 * Aborts all the pending promises.
	 * @note To avoid race conditions, this does **not** unlock the head lock.
	 */
	public abortAll(): void {
		// If there are no queued entries, skip early.
		if (this.queued === 0)
			return;

		// Abort all the entries except the head, that is why the loop starts at
		// 1 and not at 0.
		for (let i = 1; i < this.promises.length; ++i)
			this.promises[i].abort();

		this.promises.length = 1;
	}
}
