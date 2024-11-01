/**
 * Transforms a `readonly` type to be mutable
 * @example
 * ```typescript
 * interface Sample {
 * 	id: string;
 * 	hobbies: readonly string[];
 * }
 *
 * type BB = Mutable<Sample>;
 * // Expected:
 * // {
 * //    id: string;
 * //    hobbies: string[];
 * // }
 * ```
 */
export type Mutable<Type> = { -readonly [Key in keyof Type]: Type[Key] extends unknown[] | object ? Mutable<Type[Key]> : Type[Key]; };
