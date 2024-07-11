import process from 'node:process';
import { isPackageExists } from 'local-pkg';
import type { Linter } from 'eslint';
import type { Awaitable, OptionsConfig, TypedFlatConfigItem } from './types';

/**
 * A simple parser for use in AST-agnostic configs (i.e. markdown formatters, `eslint-plugin-format`)
 * @public
 */
export const parserPlain: Linter.FlatConfigParserModule = {
	meta: {
		name: 'parser-plain',
	},
	parseForESLint: text => ({
		ast: {
			body: [],
			comments: [],
			loc: { end: text.length, start: 0 },
			range: [0, text.length],
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

/**
 * Combine array and non-array configs into a single array.
 *
 * @returns A flatmap of all the `await`ed configs.
 * @public
 */
export const combine = async (...configs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>[]): Promise<TypedFlatConfigItem[]> => (await Promise.all(configs)).flat();

/**
 * Rename plugin prefixes in a rule object.
 * Accepts a map of prefixes to rename.
 *
 * @param rules The ruleset be renamed.
 * @param map A map of the original prefixes in the ruleset, and what to replace it with.
 * @returns The `rules` with renamed prefixes according to `map`.
 * @public
 *
 * @example
 * ```ts
 * import { renameRules } from '@flowr/eslint-config';
 *
 * // this will be export default [{ rules: { 'ts/indent': 'error' } }]
 * export default [{
 * 	rules: renameRules(
 * 		{'@typescript-eslint/indent': 'error' },
 * 		{ '@typescript-eslint': 'ts' },
 * 	),
 * }];
 * ```
 */
export function renameRules(rules: Record<string, any>, map: Record<string, string>) {
	return Object.fromEntries(Object.entries(rules).map(([key, value]) => {
		for (const [from, to] of Object.entries(map))
			if (key.startsWith(`${from}/`))
				return [to + key.slice(from.length), value];

		return [key, value];
	}));
}

/**
 * Rename plugin names a flat configs array
 *
 * @param configs The array of flat config items with plugin names to be renamed.
 * @param map A map of the original prefixes in the flat config items, and what to replace it with.
 * @returns The `configs` with renamed prefixes according to `map`.
 * @public
 *
 * @example
 * ```ts
 * import { renamePluginInConfigs } from '@flowr/eslint-config';
 * import someConfigs from './some-configs';
 *
 * export default renamePluginInConfigs(someConfigs, {
 * 	'@typescript-eslint': 'ts',
 * 	'import-x': 'import',
 * });
 * ```
 */
export function renamePluginInConfigs(configs: TypedFlatConfigItem[], map: Record<string, string>): TypedFlatConfigItem[] {
	return configs.map((i) => {
		const clone = { ...i };
		if (clone.rules)
			clone.rules = renameRules(clone.rules, map);
		if (clone.plugins)
			clone.plugins = Object.fromEntries(Object.entries(clone.plugins)
				.map(([key, value]) => (key in map) ? [map[key], value] : [key, value]));

		return clone;
	});
}

/**
 * Export a generic value to an array
 *
 * @param value The value to be exported as an array of generic values.
 * @returns The value transformed into an `Array<T>`.
 * @public
 */
export const toArray = <T>(value: T | T[]): T[] => Array.isArray(value) ? value : [value];

/**
 * Utility to safely fetch an `import`ed ESLint plugin.
 *
 * Since ESLint Flat Config still isn't widely adopted, many plugins don't include types or a default import by default.
 * Additionally, since we accept large version ranges in our peer dependencies, the structure of plugins may change at times.
 * This function normalizes an import of a generic ESLint plugin, ensuring it is typed and accessible.
 *
 * @param m The `import('eslint-plugin-name')` statement.
 * @returns The normalized and awaited default export.
 * @public
 *
 * @example
 * ```ts
 * import { interopDefault } from '@flowr/eslint-config';
 *
 * const myPlugin = await interopDefault(import('eslint-plugin-mine'));
 * const [myPlugin1, myPlugin2] = await Promise.all([
 * 	interopDefault(import('eslint-plugin-mine1')),
 * 	interopDefault(import('eslint-plugin-mine2')),
 * ]);
 *
 * export default [{
 * 	plugins: {
 * 		'mine': myPlugin,
 * 		'mine1': myPlugin1,
 * 		'mine2': myPlugin2,
 * 	},
 * }];
 * ```
 */
export async function interopDefault<T>(m: Awaitable<T>): Promise<T extends { default: infer U } ? U : T> {
	const resolved = await m;
	return (resolved as any).default || resolved;
}

/**
 * Ensures an array of ESLint plugin and package names exist using `local-pkg`.
 *
 * This is so we don't have to include framework-specific ESLint plugins to reduce the package size.
 * It prompts the user to install the packages if one of the packages are not detected.
 *
 * @param packages An array of the fully qualified package names to search for in `package.json`.
 * @public
 *
 * @example
 * ```ts
 * import { ensurePackages, interopDefault } from '@flowr/eslint-config';
 *
 * ensurePackages('chalk'); // checks if the package is installed, if not prompts the user in stdout.
 *
 * const chalk = interopDefault(import('chalk')); // ensures that the package is installed. add as devDependency for types
 * ```
 */
export async function ensurePackages(packages: (string | undefined)[]) {
	if (process.env.CI || process.stdout.isTTY === false)
		return;

	const nonExistingPackages = packages.filter(i => i && !isPackageExists(i)) as string[];

	if (nonExistingPackages.length === 0)
		return;

	const result = await (await import('@clack/prompts')).confirm({
		message: `${nonExistingPackages.length === 1 ? 'Package is' : 'Packages are'} required for this config: ${nonExistingPackages.join(', ')}. Do you want to install them?`,
	});
	if (result)
		await import('@antfu/install-pkg').then(i => i.installPackage(nonExistingPackages, { dev: true }));
}

export type ResolveOptions<T> = T extends boolean ? never : NonNullable<T>;

export function resolveSubOptions<K extends keyof OptionsConfig>(options: OptionsConfig, key: K): ResolveOptions<OptionsConfig[K]> {
	return typeof options[key] === 'boolean' ? {} as any : options[key] || {};
}

export function getOverrides<K extends keyof OptionsConfig>(options: OptionsConfig, key: K) {
	const sub = resolveSubOptions(options, key);
	return 'overrides' in sub ? sub.overrides : {};
}
