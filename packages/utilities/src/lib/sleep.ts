export interface SleepOptions {
	/**
	 * When provided the corresponding `AbortController` can be used to cancel an asynchronous action.
	 */
	signal?: AbortSignal | undefined;

	/**
	 * Set to `false` to indicate that the scheduled `Timeout`
	 * should not require the Node.js event loop to remain active.
	 * @default true
	 */
	ref?: boolean | undefined;
}

/**
 * Sleeps for the specified number of milliseconds.
 * For a synchronous variant, see [sleepSync](./sleepSync.d.ts).
 * @param ms The number of milliseconds to sleep.
 * @param value A value with which the promise is fulfilled.
 * @see {@link sleepSync} for a synchronous version.
 */
export async function sleep<Return = undefined>(ms: number, value?: Return, options?: SleepOptions): Promise<Return> {
	return new Promise((resolve, reject) => {
		const signal = options?.signal;
		const timer: NodeJS.Timeout | number = setTimeout(() => resolve(value!), ms);
		if (signal) {
			if (signal.aborted) {
				reject(signal.reason);
				return;
			}

			signal.addEventListener('abort', () => {
				clearTimeout(timer);
				reject(signal.reason);
			});
		}

		if (options?.ref === false && typeof timer === 'object')
			timer.unref();
	});
}
