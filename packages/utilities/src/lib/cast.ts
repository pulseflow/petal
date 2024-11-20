/**
 * Casts any value to `Type`
 *
 * Note that this function is not type-safe, and may cause runtime errors if used incorrectly.
 * Also note that this function is effectively useless in a JavaScript project, it only serves a purpose for TypeScript projects.
 *
 * @param value The value to cast to another type
 * @typeParam Type the type to cast to {@link value}
 * @returns The value but as type `Type`
 */
// eslint-disable-next-line ts/no-unnecessary-type-parameters -- testing
export function cast<Type>(value: unknown): Type {
	return value as Type;
}
