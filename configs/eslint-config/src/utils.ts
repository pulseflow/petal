import type { Awaitable, UserConfigItem } from './types.js';

/** Combine array and non-array configs into a single array. */
export async function combine(...configs: Awaitable<UserConfigItem | UserConfigItem[]>[]): Promise<UserConfigItem[]> {
	const resolved = await Promise.all(configs);
	return resolved.flat();
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

export async function interopDefault<T>(m: Awaitable<T>): Promise<T extends { default: infer U } ? U : T> {
	const resolved = await m;
	return (resolved as any).default || resolved;
}
