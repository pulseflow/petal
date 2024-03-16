// adapted from https://ravy.dev/h4/deno/src/branch/main/util

import { assert } from '~/inject/assert.js';
import type { ExtractKeysByType } from '~/types.js';

const segmenter = new Intl.Segmenter();

export function graphemes(str: string) {
	return [...segmenter.segment(str)].length;
}

export function unique<T>(arr: T[]) {
	return [...new Set(arr)];
}

export function unique_by<T>(arr: T[], ...prop: (keyof T)[]) {
	const seen = new Set();
	return arr.filter((a) => {
		const key = prop.map(p => a[p]).join('\0');
		return seen.has(key) ? false : seen.add(key);
	});
}

export function get_dimension(a: any, d = 0): number {
	return Array.isArray(a) ? get_dimension(a[0], d + 1) : d;
}

export function max<T>(arr: T[], prop: ExtractKeysByType<T, number>) {
	return Math.max(...arr.map(a => a[prop] as number));
}

export function max_by<T>(arr: T[], prop: ExtractKeysByType<T, number>) {
	return arr.reduce((a, b) => a[prop] > b[prop] ? a : b);
}

export function min<T>(arr: T[], prop: ExtractKeysByType<T, number>) {
	return Math.min(...arr.map(a => a[prop] as number));
}

export function min_by<T>(arr: T[], prop: ExtractKeysByType<T, number>) {
	arr.reduce((a, b) => a[prop] < b[prop] ? a : b);
}

export function group_by<T>(arr: T[], prop: keyof T) {
	const groups = new Map<any, T[]>();

	arr.forEach((a) => {
		const key = a[prop];
		if (!groups.has(key))
			groups.set(key, []);
		groups.get(key)!.push(a);
	});

	return [...groups.values()];
}

export async function gen2array<T>(gen: AsyncIterable<T>): Promise<T[]> {
	const out: T[] = [];
	for await (const x of gen)
		out.push(x);

	return out;
}

export function partition<T>(arr: T[], fn: (a: T) => boolean) {
	const a: T[] = [];
	const b: T[] = [];
	arr.forEach(i => (fn(i) ? a : b).push(i));
	return [a, b];
}

export function zip<T>(...arr: T[][]): T[][] {
	return Array(max(arr, 'length'))
		.fill(null).map((_, i) => arr.map(a => a[i]));
}

export type VoidPromise = Promise<void>;

const is_section = (obj: any) => typeof obj === 'object' && obj !== null;

export function stringify(obj: Record<string, any>): string {
	const [sections, props] = partition(Object.entries(obj), ([, v]) => is_section(v));

	const parsed_props = props.map(([k, v]) => `${k} = ${v}`).join('\n');
	const parsed_sections = sections.map(([k, v]) => {
		const props = stringify(v);
		return `[${k}]${props ? `\n${props}` : ''}`;
	}).join('\n\n');

	return [parsed_props, parsed_sections].filter(Boolean).join('\n\n');
}

export function count(haystack: string, needle: string, allowOverlapping = false) {
	assert(haystack).is('string');
	assert(haystack).neq('');
	assert(needle).is('string');
	assert(needle).neq('');
	assert(allowOverlapping).is('boolean');

	let n = 0;
	let pos = 0;
	const step = allowOverlapping ? 1 : needle.length;

	// eslint-disable-next-line no-cond-assign
	while ((pos = haystack.indexOf(needle, pos)) >= 0) {
		++n;
		pos += step;
	}

	return n;
}
