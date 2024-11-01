/**
 * Gets all the keys (as a string union) from a type `T` that match value `V`
 * @example
 * ```typescript
 * interface Sample {
 * 	id: string;
 * 	name: string | null;
 * 	middleName?: string;
 * 	lastName: string;
 * 	hobbies: readonly string[];
 * }
 *
 * type BB = PickByValue<Sample, string>;
 * // Expected:
 * // "id" | "lastName"
 * ```
 */
export type PickByValue<Type, Value> = { [Key in keyof Type]: Type[Key] extends Value ? Key : never; }[keyof Type] & keyof Type;
