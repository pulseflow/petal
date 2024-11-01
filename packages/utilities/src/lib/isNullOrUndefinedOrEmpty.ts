import type { Nullish } from '@flowr/types';
import { isNullOrUndefined } from './isNullOrUndefined';

/**
 * Checks whether or not a value is `null`, `undefined` or `''`, `[]`
 * @param value The value to check
 */
export function isNullOrUndefinedOrEmpty(value: unknown): value is Nullish | '' {
	return isNullOrUndefined(value) || (value as string | unknown[]).length === 0;
}
