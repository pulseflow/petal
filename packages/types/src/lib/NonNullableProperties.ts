/**
 * Similar to the built in {@link NonNullable}, but properly removes `null` from all keys in the class or interface
 * This does not recurse deeply, for that use {@link DeepRequired}
 */
export type NonNullableProperties<Type = unknown> = { [Key in keyof Type]: NonNullable<Type[Key]>; };
