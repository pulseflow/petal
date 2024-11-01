import type { Arrayable, Nullable } from '@flowr/types';

/**
 * Convert an {@link Arrayable<T>} to an {@link Array<T>}
 */
export function toArray<T>(array?: Nullable<Arrayable<T>>): T[] {
	array = array ?? [];
	return Array.isArray(array) ? array : [array];
}
