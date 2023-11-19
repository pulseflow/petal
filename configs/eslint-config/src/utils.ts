import type { ConfigItem } from './types.js';

/** Combine array and non-array configs into a single array. */
export function combine(...configs: (ConfigItem | ConfigItem[])[]): ConfigItem[] {
	return configs.flat();
}

/** Rename a list of key value paried rules in a `Record<string, any>` */
export function renameRules(rules: Record<string, any>,	from: string,	to: string) {
	return Object.fromEntries(
		Object.entries(rules).map(([key, value]) => {
			if (key.startsWith(from))
				return [to + key.slice(from.length), value];
			return [key, value];
		}),
	);
}

/** Export a generic value to an array */
export function toArray<T>(value: T | T[]): T[] {
	return Array.isArray(value) ? value : [value];
}
