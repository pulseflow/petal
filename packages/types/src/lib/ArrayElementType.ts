/**
 * Gets a union type of all the keys that are in an array.
 * @example
 * ```typescript
 * const sample = [1, 2, '3', true];
 *
 * type arrayUnion = ArrayElementType<typeof sample>;
 * // Expected: string | number | boolean
 * ```
 */
export type ArrayElementType<Type> = Type extends Array<infer Key> ? Key : Type extends ReadonlyArray<infer ReadonlyKey> ? ReadonlyKey : Type;
