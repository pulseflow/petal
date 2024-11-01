export type ThrottleFn<Function extends (...args: unknown[]) => unknown> = Function & { flush: () => void };

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `flush` method to
 * reset the last time the throttled function was invoked.
 *
 * @param func The function to throttle.
 * @param wait The number of milliseconds to throttle invocations to.
 *
 * @returns Returns the new throttled function.
 */
export function throttle<Function extends (...args: unknown[]) => unknown>(func: Function, wait: number): ThrottleFn<Function> {
	let prev = 0;
	let prevValue: ReturnType<Function>;

	return Object.assign(
		(...args: Parameters<Function>) => {
			const now = Date.now();
			if (now - prev > wait) {
				prev = now;
				return (prevValue = func(...args) as ReturnType<Function>);
			}

			return prevValue;
		},
		{
			flush() {
				prev = 0;
			},
		},
	) as ThrottleFn<Function>;
}
