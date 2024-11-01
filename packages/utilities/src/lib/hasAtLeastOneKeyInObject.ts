import { isNullOrUndefined } from './isNullOrUndefined';

/**
 * Checks whether any of the {@link keys} are in the {@link obj}
 * @param obj - The object to check
 * @param keys The keys to find in the object
 * @returns `true` if at least one of the {@link keys} is in the {@link obj}, `false` otherwise.
 *
 * @example
 * ```typescript
 * const obj = { a: 1, b: 2, c: 3 };
 * console.log(hasAtLeastOneKeyInObject(obj, ['a'])); // true
 * console.log(hasAtLeastOneKeyInObject(obj, ['d'])); // false
 * ```
 */
export function hasAtLeastOneKeyInObject<Object extends object, Key extends PropertyKey>(obj: Object, keys: readonly Key[]): obj is Object & Required<Record<Key, unknown>> {
	return !isNullOrUndefined(obj) && keys.some(key => Object.hasOwn(obj, key));
}
