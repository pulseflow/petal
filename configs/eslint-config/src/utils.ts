import type { ConfigItem } from './types.js';

/** Combine array and non-array configs into a single array. */
export const combine = (
	...configs: (ConfigItem | ConfigItem[])[]
): ConfigItem[] => configs.flat();

/** Rename a list of key value paried rules in a `Record<string, any>` */
export const renameRules = (
	rules: Record<string, any>,
	from: string,
	to: string,
) =>
	Object.fromEntries(
		Object.entries(rules).map(([key, value]) => {
			if (key.startsWith(from))
				return [to + key.slice(from.length), value];
			return [key, value];
		}),
	);

/** Export a generic value to an array */
export const toArray = <T>(value: T | T[]): T[] =>
	Array.isArray(value) ? value : [value];
