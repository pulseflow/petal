import pLimit from 'p-limit';

import type { Fn } from '../types';
import { remove } from './array';

/**
 * Internal marker for filtered items
 */
const VOID = Symbol('p-void');

interface POptions {
	/**
	 * How many promises are resolved at the same time.
	 */
	concurrency?: number | undefined;
}

class PInstance<T = any> extends Promise<Awaited<T>[]> {
	private promises = new Set<T | Promise<T>>();

	get promise(): Promise<Awaited<T>[]> {
		let batch;
		const items = [...Array.from(this.items), ...Array.from(this.promises)];

		if (this.options?.concurrency) {
			const limit = pLimit(this.options.concurrency);
			batch = Promise.all(items.map(p => limit(() => p)));
		}
		else { batch = Promise.all(items); }

		return batch.then(l => l.filter((i: any) => i !== VOID));
	}

	constructor(public items: Iterable<T> = [], public options?: POptions) {
		super(() => {});
	}

	add(...args: (T | Promise<T>)[]) {
		args.forEach(f => this.promises.add(f));
	}

	map<U>(fn: (value: Awaited<T>, index: number) => U): PInstance<Promise<U>> {
		return new PInstance(
			Array.from(this.items).map(async (i, idx) => {
				const v = await i;
				if ((v as any) === VOID)
					return VOID as unknown as U;
				return fn(v, idx);
			}),
			this.options,
		);
	}

	filter(fn: (value: Awaited<T>, index: number) => boolean | Promise<boolean>): PInstance<Promise<T>> {
		return new PInstance(
			Array.from(this.items).map(async (i, idx) => {
				const v = await i;
				const r = await fn(v, idx);
				if (!r)
					return VOID as unknown as T;
				return v;
			}),
			this.options,
		);
	}

	forEach(fn: (value: Awaited<T>, index: number) => void): Promise<void> {
		return this.map(fn).then();
	}

	reduce<U>(fn: (previousValue: U, currentValue: Awaited<T>, currentIndex: number, array: Awaited<T>[]) => U, initialValue: U): Promise<U> {
		return this.promise.then(array => array.reduce(fn, initialValue));
	}

	clear() {
		this.promises.clear();
	}

	then(fn?: () => PromiseLike<any>) {
		const p = this.promise;
		if (fn)
			return p.then(fn);
		else
			return p;
	}

	catch(fn?: (err: unknown) => PromiseLike<any>) {
		return this.promise.catch(fn);
	}

	finally(fn?: () => void) {
		return this.promise.finally(fn);
	}
}

/**
 * Utility for managing multiple promises.
 *
 * @category Promise
 * @example
 * ```
 * import { p } from '@petal/utils'
 *
 * const items = [1, 2, 3, 4, 5]
 *
 * await p(items)
 *   .map(async i => await multiply(i, 3))
 *   .filter(async i => await isEven(i))
 * // [6, 12]
 * ```
 */
export function p<T = any>(items?: Iterable<T>, options?: POptions): PInstance<T> {
	return new PInstance(items, options);
}

export interface SingletonPromiseReturn<T> {
	(): Promise<T>;
	/**
	 * Reset current staled promise.
	 * Await it to have proper shutdown.
	 */
	reset: () => Promise<void>;
}

/**
 * Create singleton promise function
 *
 * @category Promise
 */
export function createSingletonPromise<T>(fn: () => Promise<T>): SingletonPromiseReturn<T> {
	let _promise: Promise<T> | undefined;

	function wrapper() {
		if (!_promise)
			_promise = fn();
		return _promise;
	}
	wrapper.reset = async () => {
		const _prev = _promise;
		_promise = undefined;
		if (_prev)
			await _prev;
	};

	return wrapper;
}

/**
 * Promised `setTimeout`
 *
 * @category Promise
 */
export function sleep(ms: number, callback?: Fn<any>) {
	return new Promise<void>(resolve =>

		setTimeout(async () => {
			await callback?.();
			resolve();
		}, ms),
	);
}

/**
 * Create a promise lock
 *
 * @category Promise
 * @example
 * ```
 * const lock = createPromiseLock()
 *
 * lock.run(async () => {
 *   await doSomething()
 * })
 *
 * // in anther context:
 * await lock.wait() // it will wait all tasking finished
 * ```
 */
export function createPromiseLock() {
	const locks: Promise<any>[] = [];

	return {
		async run<T = void>(fn: () => Promise<T>): Promise<T> {
			const p = fn();
			locks.push(p);
			try {
				return await p;
			}
			finally {
				remove(locks, p);
			}
		},
		async wait(): Promise<void> {
			await Promise.allSettled(locks);
		},
		isWaiting() {
			return Boolean(locks.length);
		},
		clear() {
			locks.length = 0;
		},
	};
}

/**
 * Promise with `resolve` and `reject` methods of itself
 */
export interface ControlledPromise<T = void> extends Promise<T> {
	resolve: (value: T | PromiseLike<T>) => void;
	reject: (reason?: any) => void;
}

/**
 * Return a Promise with `resolve` and `reject` methods
 *
 * @category Promise
 * @example
 * ```
 * const promise = createControlledPromise()
 *
 * await promise
 *
 * // in anther context:
 * promise.resolve(data)
 * ```
 */
export function createControlledPromise<T>(): ControlledPromise<T> {
	let resolve: any, reject: any;
	const promise = new Promise<T>((_resolve, _reject) => {
		resolve = _resolve;
		reject = _reject;
	}) as ControlledPromise<T>;
	promise.resolve = resolve;
	promise.reject = reject;
	return promise;
}
