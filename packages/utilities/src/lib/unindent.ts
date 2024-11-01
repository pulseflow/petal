/**
 * Remove common leading whitespace from a template string.
 * Will also remove empty lines at the beginning and end.
 * @category string
 * @example
 * ```ts
 * const str = unindent`
 * 	if (a) {
 * 		b()
 * 	}
 * `
 */
export function unindent(str: TemplateStringsArray | string): string {
	const lines = (typeof str === 'string' ? str : str[0]).split('\n');
	const whitespaceLines = lines.map(line => /^\s*$/.test(line));

	const commonIndent = lines
		.reduce((min, line, idx) => {
			if (whitespaceLines[idx])
				return min;
			const indent = line.match(/^\s*/)?.[0].length;
			return indent === undefined ? min : Math.min(min, indent);
		}, Number.POSITIVE_INFINITY);

	let emptyLinesHead = 0;
	while (emptyLinesHead < lines.length && whitespaceLines[emptyLinesHead])
		emptyLinesHead++;
	let emptyLinesTail = 0;
	while (emptyLinesTail < lines.length && whitespaceLines[lines.length - emptyLinesTail - 1])
		emptyLinesTail++;

	return lines
		.slice(emptyLinesHead, lines.length - emptyLinesTail)
		.map(line => line.slice(commonIndent))
		.join('\n');
}
