import type { Arrayable, Nullable } from '@flowr/types';
import { toArray } from './toArray.ts';

/**
 * Convert an {@link Arrayable<T>} to an {@link Array<T>} and flatten it
 */
export function flattenArrayable<T>(array?: Nullable<Arrayable<T | T[]>>): T[] {
	return toArray(array).flat(1) as T[];
}
