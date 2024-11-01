/**
 * Transforms the first letter to a capital then adds all the rest after it
 *
 * @param str - Text to transform
 * @returns The input `str` as `Str`
 *
 * @example
 * ```ts
 * capitalizeFirstLetter('hello world') // 'Hello world'
 * ```
 */
export function capitalizeFirstLetter(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
