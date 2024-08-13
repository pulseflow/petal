import { isPackageExists } from 'local-pkg';
import { FlatConfigComposer } from 'eslint-flat-config-utils';
import type { Linter } from 'eslint';
import type { Awaitable, ConfigNames, OptionsConfig, TypedFlatConfigItem } from './types';
import {
	astro,
	command,
	comments,
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
} from './configs';
import { getOverrides, isInEditorEnv, resolveSubOptions } from './utils';

const flatConfigProps: (keyof TypedFlatConfigItem)[] = [
	'files',
	'ignores',
	'languageOptions',
	'linterOptions',
	'name',
	'plugins',
	'processor',
	'rules',
	'settings',
];

const VUE_PACKAGES = ['@slidev/cli', 'nuxt', 'vitepress', 'vue'];
const SOLID_PACKAGES = ['solid-js', 'solid-refresh', 'vite-plugin-solid'];
const SVELTE_PACKAGES = ['@sveltejs/kit', '@sveltejs/package', '@sveltejs/vite-plugin-svelte', 'svelte'];
const REACT_PACKAGES = ['react', 'react-dom', 'react-native', 'next'];
const TYPESCRIPT_PACKAGES = ['typescript', 'tsc', 'tslib'];
const QUERY_PACKAGES = ['react', 'vue', 'solid', 'svelte'].map(i => `@tanstack/${i}-query`);
const pkgSort = (i: string): boolean => isPackageExists(i);

export const defaultPluginRenaming: Record<string, string> = {
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

type FactoryOptions = OptionsConfig & TypedFlatConfigItem;
type UserConfig = Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[] | FlatConfigComposer<any, any> | Linter.Config[]>;
type FactoryComposer = FlatConfigComposer<TypedFlatConfigItem, ConfigNames>;

/**
 * Construct a Petal ESLint config.
 *
 * @param {FactoryOptions} options The options for generating the ESLint configurations.
 * @param {UserConfigs} userConfigs The user configurations to be merged with the generated configurations.
 * @returns {FactoryComposer} The merged ESLint configurations.
 */
export function defineConfig(options: FactoryOptions = {}, ...userConfigs: UserConfig[]): FactoryComposer {
	const {
		astro: enableAstro = isPackageExists('astro'),
		autoRenamePlugins = true,
		componentExts = [],
		gitignore: enableGitignore = true,
		isInEditor = isInEditorEnv(),
		jsx: enableJsx = true,
		query: enableQuery = QUERY_PACKAGES.some(pkgSort),
		react: enableReact = REACT_PACKAGES.some(pkgSort),
		regexp: enableRegexp = true,
		solid: enableSolid = SOLID_PACKAGES.some(pkgSort),
		svelte: enableSvelte = SVELTE_PACKAGES.some(pkgSort),
		typescript: enableTypeScript = TYPESCRIPT_PACKAGES.some(pkgSort),
		unocss: enableUnoCSS = false,
		vue: enableVue = VUE_PACKAGES.some(pkgSort),
	} = options;

	const stylisticOptions = options.stylistic === false
		? false
		: typeof options.stylistic === 'object'
			? options.stylistic
			: {};

	if (stylisticOptions && !('jsx' in stylisticOptions))
		stylisticOptions.jsx = enableJsx;

	const configs: Awaitable<TypedFlatConfigItem[]>[] = [];
	if (enableGitignore)
		if (typeof enableGitignore !== 'boolean')
			configs.push(gitignore(enableGitignore));
		else configs.push(gitignore({ strict: false }));

	const typescriptOptions = resolveSubOptions(options, 'typescript');
	const tsconfigPath = 'tsconfigPath' in typescriptOptions ? typescriptOptions.tsconfigPath : undefined;

	configs.push(ignores());
	configs.push(javascript({ isInEditor, overrides: getOverrides(options, 'javascript') }));
	configs.push(comments());
	configs.push(node());
	configs.push(jsdoc({ stylistic: stylisticOptions }));
	configs.push(imports({ stylistic: stylisticOptions }));
	configs.push(unicorn());
	configs.push(command());
	configs.push(perfectionist());

	if (enableVue)
		componentExts.push('vue');

	if (enableJsx)
		configs.push(jsx());

	if (enableTypeScript)
		configs.push(typescript({
			...typescriptOptions,
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
		configs.push(test({ overrides: getOverrides(options, 'test') }));

	if (enableRegexp)
		configs.push(regexp(typeof enableRegexp === 'boolean' ? {} : enableRegexp));

	if (enableVue)
		configs.push(vue({
			...resolveSubOptions(options, 'vue'),
			overrides: getOverrides(options, 'vue'),
			stylistic: stylisticOptions,
			typescript: !!enableTypeScript,
		}));

	if (enableSolid)
		configs.push(solid({
			overrides: getOverrides(options, 'solid'),
			tsconfigPath,
			typescript: !!enableTypeScript,
		}));

	if (enableAstro)
		configs.push(astro({ overrides: getOverrides(options, 'astro') }));

	if (enableReact)
		configs.push(react({
			overrides: getOverrides(options, 'react'),
			tsconfigPath,
		}));

	if (enableSvelte)
		configs.push(svelte({
			overrides: getOverrides(options, 'svelte'),
			stylistic: stylisticOptions,
			typescript: !!enableTypeScript,
		}));

	if (enableUnoCSS)
		configs.push(unocss({
			...resolveSubOptions(options, 'unocss'),
			overrides: getOverrides(options, 'unocss'),
		}));

	if (enableQuery)
		configs.push(query({
			overrides: getOverrides(options, 'query'),
		}));

	if (options.jsonc ?? true)
		configs.push(
			jsonc({
				overrides: getOverrides(options, 'jsonc'),
				stylistic: stylisticOptions,
			}),
			sortPackageJson(),
			sortTsConfig(),
		);

	if (options.yaml ?? true)
		configs.push(yaml({
			overrides: getOverrides(options, 'yaml'),
			stylistic: stylisticOptions,
		}));

	if (options.toml ?? true)
		configs.push(toml({
			overrides: getOverrides(options, 'toml'),
			stylistic: stylisticOptions,
		}));

	if (options.schema ?? true)
		configs.push(schema({
			overrides: getOverrides(options, 'schema'),
		}));

	if (options.markdown ?? true)
		configs.push(markdown({
			componentExts,
			overrides: getOverrides(options, 'markdown'),
		}));

	if (options.formatters)
		configs.push(formatters(
			options.formatters,
			typeof stylisticOptions === 'boolean' ? {} : stylisticOptions,
		));

	const fusedConfig = flatConfigProps.reduce((curr, key) => {
		if (key in options)
			curr[key] = options[key] as any;
		return curr;
	}, {} as TypedFlatConfigItem);

	if (Object.keys(fusedConfig).length)
		configs.push([fusedConfig]);

	let composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>()
		.append(...configs, ...userConfigs as any);

	if (autoRenamePlugins)
		composer = composer.renamePlugins(defaultPluginRenaming);

	return composer;
}
