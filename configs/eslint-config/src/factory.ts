import fs from 'node:fs';
import process from 'node:process';
import { isPackageExists } from 'local-pkg';
import type { Awaitable, FlatConfigItem, OptionsConfig, UserConfigItem } from './types.js';
import {
	astro,
	comments,
	ignores,
	imports,
	javascript,
	jest,
	jsdoc,
	jsonc,
	markdown,
	node,
	perfectionist,
	react,
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
} from './configs/index.js';
import { combine, interopDefault } from './utils.js';
import { formatters } from './configs/formatters.js';

const flatConfigProps: (keyof FlatConfigItem)[] = [
	'name',
	'files',
	'ignores',
	'languageOptions',
	'linterOptions',
	'processor',
	'plugins',
	'rules',
	'settings',
];

const VuePackages = ['vue', 'nuxt', 'vitepress', '@slidev/cli'];
const JestPackages = ['@jest/globals', '@types/jest', 'jest'];
const SolidPackages = ['solid-js', 'vite-plugin-solid', 'solid-refresh'];

/**
 * Construct a Petal ESLint config.
 */
export function petal(
	options: OptionsConfig & FlatConfigItem = {},
	...userConfigs: Awaitable<UserConfigItem | UserConfigItem[]>[]
): Promise<UserConfigItem[]> {
	const {
		astro: enableAstro = isPackageExists('astro'),
		componentExts = [],
		gitignore: enableGitignore = true,
		isInEditor = !!(
			(process.env.VSCODE_PID || process.env.VSCODE_CWD || process.env.JETBRAINS_IDE || process.env.VIM)
			&& !process.env.CI
		),
		jest: enableJest = JestPackages.some(i => isPackageExists(i)),
		react: enableReact = isPackageExists('react'),
		solid: enableSolid = SolidPackages.some(i => isPackageExists(i)),
		svelte: enableSvelte = false,
		typescript: enableTypeScript = isPackageExists('typescript'),
		unocss: enableUnoCSS = false,
		vue: enableVue = VuePackages.some(i => isPackageExists(i)),
	} = options;

	const stylisticOptions
		= options.stylistic === false
			? false
			: typeof options.stylistic === 'object'
				? options.stylistic
				: {};

	if (stylisticOptions && !('jsx' in stylisticOptions))
		stylisticOptions.jsx = options.jsx ?? true;

	const configs: Awaitable<FlatConfigItem[]>[] = [];
	if (enableGitignore) {
		if (typeof enableGitignore !== 'boolean')
			configs.push(interopDefault(import('eslint-config-flat-gitignore')).then(r => [r(enableGitignore)]));
		else if (fs.existsSync('.gitignore'))
			configs.push(interopDefault(import('eslint-config-flat-gitignore')).then(r => [r()]));
	}

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
		perfectionist(),
	);

	if (enableVue)
		componentExts.push('vue');

	if (enableTypeScript) {
		configs.push(typescript({
			...resolveSubOptions(options, 'typescript'),
			componentExts,
			overrides: getOverrides(options, 'typescript'),
		}));
	}

	if (stylisticOptions) {
		configs.push(stylistic({
			...stylisticOptions,
			overrides: getOverrides(options, 'stylistic'),
		}));
	}

	if (options.test ?? true)
		configs.push(test({ isInEditor, overrides: getOverrides(options, 'test') }));

	if (enableJest)
		configs.push(jest({ isInEditor, overrides: getOverrides(options, 'jest') }));

	if (enableVue) {
		configs.push(vue({
			...resolveSubOptions(options, 'vue'),
			overrides: getOverrides(options, 'vue'),
			stylistic: stylisticOptions,
			typescript: !!enableTypeScript,
		}));
	}

	if (enableSolid) {
		configs.push(solid({
			overrides: getOverrides(options, 'solid'),
			typescript: !!enableTypeScript,
		}));
	}

	if (enableAstro) {
		configs.push(astro({
			overrides: getOverrides(options, 'astro'),
			typescript: !!enableTypeScript,
		}));
	}

	if (enableReact) {
		configs.push(react({
			overrides: getOverrides(options, 'react'),
			typescript: !!enableTypeScript,
		}));
	}

	if (enableSvelte) {
		configs.push(svelte({
			overrides: getOverrides(options, 'svelte'),
			stylistic: stylisticOptions,
			typescript: !!enableTypeScript,
		}));
	}

	if (enableUnoCSS) {
		configs.push(unocss({
			...resolveSubOptions(options, 'unocss'),
			overrides: getOverrides(options, 'unocss'),
		}));
	}

	if (options.jsonc ?? true) {
		configs.push(
			jsonc({
				overrides: getOverrides(options, 'jsonc'),
				stylistic: stylisticOptions,
			}),
			sortPackageJson(),
			sortTsConfig(),
		);
	}

	if (options.yaml ?? true) {
		configs.push(yaml({
			overrides: getOverrides(options, 'yaml'),
			stylistic: stylisticOptions,
		}));
	}

	if (options.toml ?? true) {
		configs.push(toml({
			overrides: getOverrides(options, 'toml'),
			stylistic: stylisticOptions,
		}));
	}

	if (options.markdown ?? true) {
		configs.push(markdown({
			componentExts,
			overrides: getOverrides(options, 'markdown'),
		}));
	}

	if (options.formatters) {
		configs.push(formatters(
			options.formatters,
			typeof stylisticOptions === 'boolean' ? {} : stylisticOptions,
		));
	}

	const fusedConfig = flatConfigProps.reduce((acc, key) => {
		if (key in options)
			acc[key] = options[key] as any;
		return acc;
	}, {} as FlatConfigItem);

	if (Object.keys(fusedConfig).length)
		configs.push([fusedConfig]);

	const merged = combine(
		...configs,
		...userConfigs,
	);

	return merged;
}

export type ResolveOptions<T> = T extends boolean
	? never
	: NonNullable<T>;

export function resolveSubOptions<K extends keyof OptionsConfig>(
	options: OptionsConfig,
	key: K,
): ResolveOptions<OptionsConfig[K]> {
	return typeof options[key] === 'boolean'
		? {} as any
		: options[key] || {};
}

export function getOverrides<K extends keyof OptionsConfig>(
	options: OptionsConfig,
	key: K,
) {
	const sub = resolveSubOptions(options, key);
	return {
		...(options.overrides as any)?.[key],
		...'overrides' in sub
			? sub.overrides
			: {},
	};
}
