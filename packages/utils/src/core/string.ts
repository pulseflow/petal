import { isObject } from './assert';

export const toString = (v: any): string => Object.prototype.toString.call(v);

export type Strings = string[] | ReadonlyArray<string>;

export function untemplate<T extends Strings>(strings: T, ...keys: any[]): string {
	if (keys.length === 0)
		return strings.join(' ');
	return strings.reduce((acc, str, i) => {
		const key = keys[i];
		if (key)
			return acc + key.toString() + str;
		else return acc + str;
	}, '');
}

/**
 * Replace backslash to slash
 *
 * @category String
 */
export const slash = (str: string): string => str.replace(/\\/g, '/');

/**
 * Ensure prefix of a string
 *
 * @category String
 */
export const ensurePrefix = (prefix: string, str: string): string => !str.startsWith(prefix) ? prefix + str : str;

/**
 * Ensure suffix of a string
 *
 * @category String
 */
export const ensureSuffix = (suffix: string, str: string): string => !str.endsWith(suffix) ? str + suffix : str;

/**
 * Ensure an LF line ending
 *
 * @category String
 */
export const normalizeLF = (str: string): string => str.replace(/\r\n/g, '\n');

/**
 * Dead simple template engine, just like Python's `.format()`
 * Support passing variables as either in index based or object/name based approach
 * While using object/name based approach, you can pass a fallback value as the third argument
 *
 * @category String
 * @example
 */
export function template(str: string, object: Record<string | number, any>, fallback?: string | ((key: string) => string)): string;
export function template(str: string, ...args: (string | number | bigint | undefined | null)[]): string;
export function template(str: string, ...args: any[]): string {
	const [firstArg, fallback] = args;

	if (isObject(firstArg)) {
		const vars = firstArg as Record<string, any>;
		return str.replace(/\{(\w+)\}/g, (_, key) => vars[key] || ((typeof fallback === 'function' ? fallback(key) : fallback) ?? key));
	}
	else {
		return str.replace(/\{(\d+)\}/g, (_, key) => {
			const index = Number(key);
			if (Number.isNaN(index))
				return key;
			return args[index];
		});
	}
}

// port from nanoid
// https://github.com/ai/nanoid
const URL_ALPHABET: string = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';
/**
 * Generate a random string
 * @category String
 */
export function randomStr(size = 16, dict = URL_ALPHABET): string {
	let id = '';
	let i = size;
	const len = dict.length;
	while (i--) id += dict[(Math.random() * len) | 0];
	return id;
}

/**
 * First letter uppercase, other lowercase (I HATE CAPITALISM)
 * @category string
 * @example
 * ```ts
 * capitalize('hello') => 'Hello'
 * ```
 */
export const capitalize = (str: string): string => str[0].toUpperCase() + str.slice(1).toLowerCase();

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
 * ```
 */
export function unindent(strings: TemplateStringsArray, ...keys: any[]): string {
	const lines = normalizeLF(untemplate(strings, ...keys)).split('\n');
	const whitespaceLines = lines.map(f => /^\s*$/.test(f));

	const commonIndent = lines.reduce((min, line, idx) => {
		if (whitespaceLines[idx])
			return min;
		const indent = line.match(/^\s*/)?.[0].length;
		return indent === undefined ? min : Math.min(min, indent);
	}, Number.POSITIVE_INFINITY);

	let emptyLinesHead = 0;
	while (emptyLinesHead < lines.length && whitespaceLines[emptyLinesHead]) emptyLinesHead++;
	let emptyLinesTail = 0;
	while (emptyLinesTail < lines.length && whitespaceLines[lines.length - emptyLinesTail - 1]) emptyLinesTail++;

	return lines.slice(emptyLinesHead, lines.length - emptyLinesTail).map(line => line.slice(commonIndent)).join('\n');
}
