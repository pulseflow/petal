import { assertNotNegative } from './shared/_assertNotNegative.ts';
import { makeIterableIterator } from './shared/_makeIterableIterator.ts';
import { toNumberOrThrow } from './shared/_toNumberOrThrow.ts';

/**
 * Creates an iterable that repeats the input iterable `count` times.
 *
 * @param value The value to be repeated.
 * @param count The number of times to repeat the value.
 *
 * @example
 * ```typescript
 * import { repeat } from '@flowr/iterator';
 *
 * const iterator = repeat('Hello, world!', 3);
 * console.log([...iterator]);
 * // Output: ['Hello, world!', 'Hello, world!', 'Hello, world!']
 * ```
 *
 * @remarks This function does not clone `value`, it will be repeated as a reference.
 */
export function repeat<const ElementType>(value: ElementType, count: number): IterableIterator<ElementType> {
	count = assertNotNegative(toNumberOrThrow(count), count);

	let i = 0;
	return makeIterableIterator<ElementType>(() =>
		i >= count //
			? { done: true, value: undefined }
			: (i++, { done: false, value }),
	);
}
