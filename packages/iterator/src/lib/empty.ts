import { makeIterableIterator } from './shared/_makeIterableIterator.ts';

/**
 * Creates an empty iterator.
 *
 * @returns An empty iterator.
 *
 * @example
 * ```typescript
 * import { empty } from '@flowr/iterator';
 *
 * const iterable = empty();
 * console.log([...iterable]);
 * // Output: []
 * ```
 */
export function empty<const ElementType = never>(): IterableIterator<ElementType> {
	return makeIterableIterator<ElementType>(() => ({ done: true, value: undefined }));
}
