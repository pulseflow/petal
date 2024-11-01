import type { Linter } from 'eslint';
import type { Awaitable, ConfigNames, OptionsConfig, TypedFlatConfigItem } from './types/index.ts';
import { FlatConfigComposer } from 'eslint-flat-config-utils';
import { isPackageExists } from 'local-pkg';
import {
	astro,
	command,
	comments,
	disables,
	formatters,
	gitignore,
	ignores,
	imports,
	javascript,
	jsdoc,
	jsonc,
	jsx,
	markdown,
	node,
	perfectionist,
	query,
	react,
	regexp,
	schema,
	solid,
	sortPackageJson,
	sortTsConfig,
	stylistic,
	svelte,
	test,
	toml,
	typescript,
	unicorn,
	unocss,
	vue,
	yaml,
} from './configs/index.ts';
import { getOverrides, isInEditorEnv, resolveSubOptions } from './utils.ts';

const flatConfigProps = ['languageOptions', 'linterOptions', 'name', 'plugins', 'processor', 'rules', 'settings'] satisfies Array<keyof TypedFlatConfigItem>;
const VUE_PACKAGES = ['@slidev/cli', 'nuxt', 'vitepress', 'vue'];
const SOLID_PACKAGES = ['solid-js', 'solid-refresh', 'vite-plugin-solid'];
const SVELTE_PACKAGES = ['@sveltejs/kit', '@sveltejs/package', '@sveltejs/vite-plugin-svelte', 'svelte'];
const REACT_PACKAGES = ['react', 'react-dom', 'react-native', 'next'];
const TYPESCRIPT_PACKAGES = ['typescript', 'tsc', 'tslib'];
const QUERY_PACKAGES = ['react', 'vue', 'solid', 'svelte'].map(i => `@tanstack/${i}-query`);
const pkgSort = (i: string): boolean => isPackageExists(i);

export const DEFAULT_PLUGIN_RENAMING = {
	'@eslint-react': 'react',
	'@eslint-react/dom': 'react-dom',
	'@eslint-react/hooks-extra': 'react-hooks-extra',
	'@eslint-react/naming-convention': 'react-naming-convention',

	'@stylistic': 'style',
	'@typescript-eslint': 'ts',
	'import-x': 'import',
	'json-schema-validator': 'schema',
	'n': 'node',
	'vitest': 'test',
	'vuejs-accessibility': 'vue-a11y',
	'yml': 'yaml',
};

export type FactoryOptions = OptionsConfig & Omit<TypedFlatConfigItem, 'files'>;
export type UserConfig = Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[] | FlatConfigComposer | Linter.Config[]>;
export type FactoryComposer = FlatConfigComposer<TypedFlatConfigItem, ConfigNames>;

/**
 * Construct a Petal ESLint config.
 *
 * @param {FactoryOptions} options The options for generating the ESLint configurations.
 * @param {UserConfig[]} userConfigs The user configurations to be merged with the generated configurations.
 * @returns {FactoryComposer} The merged ESLint configurations.
 * @public
 */
// eslint-disable-next-line ts/promise-function-async -- `FlatConfigComposer` has `Promise`-like methods, but isnt async
export function defineConfig(options: FactoryOptions = {}, ...userConfigs: UserConfig[]): FactoryComposer {
	const configs: Array<Awaitable<TypedFlatConfigItem[]>> = [];
	const isInEditor = options.isInEditor ?? isInEditorEnv();
	const stylisticOptions = options.stylistic === false ? false : typeof options.stylistic === 'object' ? options.stylistic : {};
	const componentExts = options.componentExts ?? [];
	const typescriptEnabled = options.typescript ?? TYPESCRIPT_PACKAGES.some(pkgSort);
	const tsconfigPath = 'tsconfigPath' in resolveSubOptions(options, 'typescript')
		? resolveSubOptions(options, 'typescript').tsconfigPath
		: undefined;

	if (isInEditor)
		// eslint-disable-next-line no-console -- debug editor message
		console.info('[@flowr/eslint]: running in editor - some rules are disabled');

	if (stylisticOptions && !('jsx' in stylisticOptions))
		stylisticOptions.jsx = options.jsx ?? true;

	if (options.gitignore ?? true)
		if (typeof options.gitignore !== 'boolean')
			configs.push(gitignore(options.gitignore));
		else configs.push(gitignore({ strict: false }));

	configs.push(ignores(options.ignores));
	configs.push(javascript({ isInEditor, overrides: getOverrides(options, 'javascript') }));
	configs.push(comments());
	configs.push(node());
	configs.push(jsdoc({ stylistic: stylisticOptions }));
	configs.push(imports({ stylistic: stylisticOptions }));
	configs.push(command());
	configs.push(perfectionist());

	if (options.unicorn ?? true)
		configs.push(unicorn(resolveSubOptions(options, 'unicorn')));

	if (options.vue ?? VUE_PACKAGES.some(pkgSort))
		componentExts.push('vue');

	if (options.jsx ?? true)
		configs.push(jsx());

	if (typescriptEnabled)
		configs.push(typescript({
			...resolveSubOptions(options, 'typescript'),
			componentExts,
			overrides: getOverrides(options, 'typescript'),
			type: options.type,
		}));

	if (stylisticOptions)
		configs.push(stylistic({
			...stylisticOptions,
			opinionated: options.opinionated,
			overrides: getOverrides(options, 'stylistic'),
		}));

	if (options.test ?? true)
		configs.push(test({
			...resolveSubOptions(options, 'test'),
			overrides: getOverrides(options, 'test'),
		}));

	if (options.regexp ?? true)
		configs.push(regexp({
			...resolveSubOptions(options, 'regexp'),
			overrides: getOverrides(options, 'regexp'),
		}));

	if (options.vue ?? VUE_PACKAGES.some(pkgSort))
		configs.push(vue({
			...resolveSubOptions(options, 'vue'),
			overrides: getOverrides(options, 'vue'),
			stylistic: stylisticOptions,
			typescript: !!typescriptEnabled,
		}));

	if (options.solid ?? SOLID_PACKAGES.some(pkgSort))
		configs.push(solid({
			...resolveSubOptions(options, 'solid'),
			overrides: getOverrides(options, 'solid'),
			tsconfigPath,
			typescript: !!typescriptEnabled,
		}));

	if (options.astro ?? isPackageExists('astro'))
		configs.push(astro({
			...resolveSubOptions(options, 'astro'),
			overrides: getOverrides(options, 'astro'),
		}));

	if (options.react ?? REACT_PACKAGES.some(pkgSort))
		configs.push(react({
			...resolveSubOptions(options, 'typescript'),
			...resolveSubOptions(options, 'react'),
			overrides: getOverrides(options, 'react'),
			tsconfigPath,
		}));

	if (options.svelte ?? SVELTE_PACKAGES.some(pkgSort))
		configs.push(svelte({
			...resolveSubOptions(options, 'svelte'),
			overrides: getOverrides(options, 'svelte'),
			stylistic: stylisticOptions,
			typescript: !!typescriptEnabled,
		}));

	if (options.unocss ?? false)
		configs.push(unocss({
			...resolveSubOptions(options, 'unocss'),
			overrides: getOverrides(options, 'unocss'),
		}));

	if (options.query ?? QUERY_PACKAGES.some(pkgSort))
		configs.push(query({
			...resolveSubOptions(options, 'query'),
			overrides: getOverrides(options, 'query'),
		}));

	if (options.jsonc ?? true)
		configs.push(
			jsonc({
				...resolveSubOptions(options, 'jsonc'),
				overrides: getOverrides(options, 'jsonc'),
				stylistic: stylisticOptions,
			}),
			sortPackageJson(),
			sortTsConfig(),
		);

	if (options.yaml ?? true)
		configs.push(yaml({
			...resolveSubOptions(options, 'yaml'),
			overrides: getOverrides(options, 'yaml'),
			stylistic: stylisticOptions,
		}));

	if (options.toml ?? true)
		configs.push(toml({
			...resolveSubOptions(options, 'toml'),
			overrides: getOverrides(options, 'toml'),
			stylistic: stylisticOptions,
		}));

	if (options.schema ?? false)
		configs.push(schema({
			...resolveSubOptions(options, 'schema'),
			overrides: getOverrides(options, 'schema'),
		}));

	if (options.markdown ?? true)
		configs.push(markdown({
			...resolveSubOptions(options, 'markdown'),
			componentExts,
			overrides: getOverrides(options, 'markdown'),
		}));

	if (options.formatters)
		configs.push(formatters(
			options.formatters,
			typeof stylisticOptions === 'boolean' ? {} : stylisticOptions,
		));

	configs.push(disables());

	if ('files' in options)
		throw new Error('[@flowr/eslint]: the first argument should not contain the "files" property as options are supposed to be global. place it in a different config block instead.');

	const fusedConfig = flatConfigProps.reduce((curr, key) => {
		if (key in options)
			curr[key] = options[key] as any;
		return curr;
	}, {} as TypedFlatConfigItem);

	if (Object.keys(fusedConfig).length)
		configs.push([fusedConfig]);

	const composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>()
		.append(...configs, ...userConfigs as TypedFlatConfigItem[]);

	if (options.autoRenamePlugins ?? true)
		return composer.renamePlugins(DEFAULT_PLUGIN_RENAMING);

	return composer;
}
