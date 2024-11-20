import type { Linter } from 'eslint';
import type { Rules } from './index.ts';
import type { Awaitable, OptionsConfig, TypedFlatConfigItem } from './types/index.ts';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { isPackageExists } from 'local-pkg';

const scopeUrl = fileURLToPath(new URL('.', import.meta.url));
const isCwdInScope = isPackageExists('@flowr/eslint');

/**
 * A simple parser for use in AST-agnostic configs (i.e. `@eslint/markdown`, `eslint-plugin-format`).
 *
 * @public
 */
export const parserPlain: Linter.Parser = {
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
 * @param configs The configs to combine.
 * @returns A flatmap of all the `await`ed configs.
 * @public
 */
export const combine = async (...configs: Array<Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>>): Promise<TypedFlatConfigItem[]> => (await Promise.all(configs)).flat();

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
 * import { renameRules } from '@flowr/eslint';
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
export function renameRules<RuleType = Linter.RuleEntry>(
	rules: Record<string, RuleType>,
	map: Record<string, string>,
): Record<string, RuleType>;
export function renameRules(
	rules: Record<string, unknown>,
	map: Record<string, string>,
): Record<string, unknown> {
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
 * import { renamePluginInConfigs } from '@flowr/eslint';
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
 * @returns The value transformed into an `Array<Type>`.
 * @typeParam Type the type of the array.
 * @public
 */
export const toArray = <Type>(value: Type | Type[]): Type[] => Array.isArray(value) ? value : [value];

/**
 * Utility to safely fetch an `import`ed ESLint plugin.
 *
 * Since ESLint Flat Config still isn't widely adopted, many plugins don't include types or a default import by default.
 * Additionally, since we accept large version ranges in our peer dependencies, the structure of plugins may change at times.
 * This function normalizes an import of a generic ESLint plugin, ensuring it is typed and accessible.
 *
 * @param module The `import('eslint-plugin-name')` statement.
 * @typeParam Import the type of the `import('eslint-plugin-name`)` statement.
 * @returns The normalized and awaited default export.
 * @public
 *
 * @example
 * ```ts
 * import { interopDefault } from '@flowr/eslint';
 *
 * const myPlugin = await interopDefault(import('eslint-plugin-mine'));
 * const [myPlugin1, myPlugin2] = await Promise.all([
 * 	interopDefault(import('eslint-plugin-mine1')),
 * 	interopDefault(import('eslint-plugin-mine2')),
 * ] as const);
 *
 * export default [{
 * 	plugins: {
 * 		mine: myPlugin,
 * 		mine1: myPlugin1,
 * 		mine2: myPlugin2,
 * 	},
 * }];
 * ```
 */
export async function interopDefault<Import>(module: Awaitable<Import>): Promise<Import extends { default: infer Default } ? Default : Import> {
	const resolved = await module;
	return (resolved as any).default ?? resolved;
}

export const isPackageInScope = (name: string): boolean => isPackageExists(name, { paths: [scopeUrl] });

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
 * import { ensurePackages, interopDefault } from '@flowr/eslint';
 *
 * ensurePackages('chalk'); // checks if the package is installed, if not prompts the user in stdout.
 *
 * const chalk = interopDefault(import('chalk')); // ensures that the package is installed. add as devDependency for types
 * ```
 */
export async function ensurePackages(packages: Array<string | undefined>): Promise<void> {
	if (process.env.CI || !process.stdout.isTTY || !isCwdInScope)
		return;

	const nonExistingPackages = packages.filter(i => i && !isPackageInScope(i)) as string[];

	if (nonExistingPackages.length === 0)
		return;

	const result = await (await import('@clack/prompts')).confirm({
		message: `${nonExistingPackages.length === 1 ? 'Package is' : 'Packages are'} required for this config: ${nonExistingPackages.join(', ')}. Do you want to install them?`,
	});
	if (result)
		await import('@antfu/install-pkg').then(async i => i.installPackage(nonExistingPackages, { dev: true }));
}

export type ResolveOptions<Resolver> = Resolver extends boolean ? never : NonNullable<Resolver>;
export function resolveSubOptions<Key extends keyof OptionsConfig>(options: OptionsConfig, key: Key): ResolveOptions<OptionsConfig[Key]> {
	return typeof options[key] === 'boolean' ? {} as any : options[key] || {};
}

// eslint-disable-next-line ts/no-unnecessary-type-parameters -- weird types
export function getOverrides<Key extends keyof OptionsConfig>(options: OptionsConfig, key: Key): Partial<Linter.RulesRecord & Rules> {
	const sub = resolveSubOptions(options, key);
	return { ...'overrides' in sub ? sub.overrides : {} };
}

export function isInEditorEnv(): boolean {
	if (process.env.CI)
		return false;
	if (isInHook())
		return false;

	// eslint-disable-next-line ts/no-unnecessary-condition -- codeflow
	return !!(false
		|| process.env.VSCODE_PID
		|| process.env.VSCODE_CWD
		|| process.env.JETBRAINS_IDE
		|| process.env.VIM
		|| process.env.NVIM
	);
}

export function isInHook(): boolean {
	// eslint-disable-next-line ts/no-unnecessary-condition -- codeflow
	return !!(false
		|| process.env.GIT_PARAMS
		|| process.env.VSCODE_GIT_COMMAND
		|| process.env.npm_lifecycle_script?.startsWith('lint-staged')
	);
}
