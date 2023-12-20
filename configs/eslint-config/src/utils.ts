import process from 'node:process';
import { isPackageExists } from 'local-pkg';
import type { Awaitable, UserConfigItem } from './types.js';

export const parserPlain = {
	meta: {
		name: 'parser-plain',
	},
	parseForESLint: (code: string) => ({
		ast: {
			body: [],
			comments: [],
			loc: { end: code.length, start: 0 },
			range: [0, code.length],
			tokens: [],
			type: 'Program',
		},
		scopeManager: null,
		services: { isPlain: true },
		visitorKeys: {
			Program: [],
		},
	}),
};

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

export async function ensurePackages(pkgs: string[]) {
	if (process.env.CI || process.stdout.isTTY === false)
		return;

	const absentPkgs = pkgs.filter(p => !isPackageExists(p));
	if (absentPkgs.length === 0)
		return;

	const { default: prompts } = await import('prompts');
	const { result } = await prompts([
		{
			message: `${absentPkgs.length === 1 ? 'A package is' : 'Packages are'} required for this config:
			${absentPkgs.join(', ')}. Do you want to install them?`,
			name: 'result',
			type: 'confirm',
		},
	]);

	if (result)
		await import('@antfu/install-pkg').then(i => i.installPackage(absentPkgs, { dev: true }));
}
