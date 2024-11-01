/**
 * Converts a TypeScript enum to a 1-way object, stripping out the number keys.
 * @param enumObject The enum to convert
 * @example
 * ```typescript
 * enum Permissions {
 * 	Read: 1 << 0,
 * 	Write: 1 << 1
 * }
 * // {
 * // 	Read: 1,
 * // 	Write: 2,
 * // 	1: 'Read',
 * // 	2: 'Write'
 * // }
 *
 * enumToObject(Permissions);
 * // { Read: 1, Write: 2 }
 * ```
 * @returns The mapped object
 */
export function enumToObject<Enum extends object>(enumObject: Enum): { [Key in Exclude<keyof Enum, `${number}`>]: Enum[Key] } {
	const result = {} as { [Key in Exclude<keyof Enum, `${number}`>]: Enum[Key] };
	for (const [key, value] of Object.entries(enumObject))
		if (Number.isNaN(Number(key)))
			result[key as Exclude<keyof Enum, `${number}`>] = value;

	return result;
}
