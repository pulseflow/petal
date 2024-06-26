import fs from 'node:fs';
import process from 'node:process';
import { isPackageExists } from 'local-pkg';
import { FlatConfigComposer } from 'eslint-flat-config-utils';
import type { Linter } from 'eslint';
import type { Awaitable, ConfigNames, OptionsConfig, TypedFlatConfigItem } from './types';
import {
	astro,
	command,
	comments,
	formatters,
	ignores,
	imports,
	javascript,
	jsdoc,
	jsonc,
	jsx,
	markdown,
	node,
	perfectionist,
	react,
	regexp,
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
import { interopDefault } from './utils';

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

const VuePackages = ['@slidev/cli', 'nuxt', 'vitepress', 'vue'];
const SolidPackages = ['solid-js', 'solid-refresh', 'vite-plugin-solid'];
const SveltePackages = ['@sveltejs/kit', '@sveltejs/package', '@sveltejs/vite-plugin-svelte', 'svelte'];
const CheckIsInEditor = () => !!((process.env.VSCODE_PID || process.env.VSCODE_CWD || process.env.JETBRAINS_IDE || process.env.VIM || process.env.NVIM) && !process.env.CI);

export const defaultPluginRenaming = {
	'@eslint-react': 'react',
	'@eslint-react/dom': 'react-dom',
	'@eslint-react/hooks-extra': 'react-hooks-extra',
	'@eslint-react/naming-convention': 'react-naming-convention',

	'@stylistic': 'style',
	'@typescript-eslint': 'ts',
	'import-x': 'import',
	'n': 'node',
	'vitest': 'test',
	'vuejs-accessibility': 'vue-a11y',
	'yml': 'yaml',
};

/**
 * Construct a Petal ESLint config.
 *
 *
 * @param {OptionsConfig & TypedFlatConfigItem} options
 *  The options for generating the ESLint configurations.
 * @param {Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>[]} userConfigs
 *  The user configurations to be merged with the generated configurations.
 * @returns {Promise<TypedFlatConfigItem[]>}
 *  The merged ESLint configurations.
 */
export function petal(
	options: OptionsConfig & TypedFlatConfigItem = {},
	...userConfigs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[] | FlatConfigComposer<any, any> | Linter.FlatConfig[]>[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
	const {
		astro: enableAstro = isPackageExists('astro'),
		autoRenamePlugins = true,
		componentExts = [],
		gitignore: enableGitignore = true,
		isInEditor = CheckIsInEditor(),
		jsx: enableJsx = true,
		react: enableReact = false,
		regexp: enableRegexp = true,
		solid: enableSolid = SolidPackages.some(i => isPackageExists(i)),
		svelte: enableSvelte = SveltePackages.some(i => isPackageExists(i)),
		typescript: enableTypeScript = isPackageExists('typescript'),
		unocss: enableUnoCSS = false,
		vue: enableVue = VuePackages.some(i => isPackageExists(i)),
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
			configs.push(interopDefault(import('eslint-config-flat-gitignore')).then(r => [r(enableGitignore)]));
		else if (fs.existsSync('.gitignore'))
			configs.push(interopDefault(import('eslint-config-flat-gitignore')).then(r => [r()]));

	const typescriptOptions = resolveSubOptions(options, 'typescript');
	const tsconfigPath = 'tsconfigPath' in typescriptOptions ? typescriptOptions.tsconfigPath : undefined;

	configs.push(
		ignores(),
		javascript({
			isInEditor,
			overrides: getOverrides(options, 'javascript'),
		}),
		comments(),
		node(),
		jsdoc({
			stylistic: stylisticOptions,
		}),
		imports({
			stylistic: stylisticOptions,
		}),
		unicorn(),
		command(),
		perfectionist(),
	);

	if (enableVue)
		componentExts.push('vue');

	if (enableJsx)
		configs.push(jsx());

	if (enableTypeScript)
		configs.push(typescript({
			...typescriptOptions,
			componentExts,
			overrides: getOverrides(options, 'typescript'),
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

	const fusedConfig = flatConfigProps.reduce((acc, key) => {
		if (key in options)
			acc[key] = options[key] as any;
		return acc;
	}, {} as TypedFlatConfigItem);

	if (Object.keys(fusedConfig).length)
		configs.push([fusedConfig]);
	let composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>();
	composer = composer.append(...configs, ...userConfigs as any);
	if (autoRenamePlugins)
		composer = composer.renamePlugins(defaultPluginRenaming);

	return composer;
}

export type ResolveOptions<T> = T extends boolean ? never : NonNullable<T>;

export function resolveSubOptions<K extends keyof OptionsConfig>(options: OptionsConfig, key: K): ResolveOptions<OptionsConfig[K]> {
	return typeof options[key] === 'boolean' ? {} as any : options[key] || {};
}

export function getOverrides<K extends keyof OptionsConfig>(options: OptionsConfig, key: K) {
	const sub = resolveSubOptions(options, key);
	return {
		...(options.overrides as any)?.[key],
		...'overrides' in sub ? sub.overrides : {},
	};
}
