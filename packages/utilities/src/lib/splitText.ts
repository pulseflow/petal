/**
 * Split a string by its latest space character in a range from the character 0 to the selected one.
 * @param str The text to split.
 * @param length The length of the desired string.
 * @param char The character to split with
 */
export function splitText(str: string, length: number, char = ' '): string {
	const x = str.substring(0, length).lastIndexOf(char);
	const pos = x === -1 ? length : x;
	return str.substring(0, pos);
}
