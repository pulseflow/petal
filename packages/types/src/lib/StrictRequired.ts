/**
 * Transforms every key in an object to be strictly required, essentially removing `undefined` and `null` from the type.
 * @example
 * ```typescript
 * interface Sample {
 * 	id: string;
 * 	name: string | null;
 * 	middleName?: string;
 * }
 *
 * type BB = StrictRequired<Sample>;
 * // Expected:
 * // {
 * //    id: string;
 * //    name: string;
 * //    middleName: string;
 * // }
 * ```
 */
export type StrictRequired<Type> = { [Key in keyof Type]-?: NonNullable<Type[Key]>; };
