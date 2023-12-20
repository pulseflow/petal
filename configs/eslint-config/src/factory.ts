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
	sortPackageJson,
	sortTsConfig,
	stylistic,
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
			(process.env.VSCODE_PID || process.env.JETBRAINS_IDE || process.env.VIM)
			&& !process.env.CI
		),
		jest: enableJest = JestPackages.some(i => isPackageExists(i)),
		overrides = {},
		react: enableReact = isPackageExists('react'),
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
			overrides: overrides.javascript,
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
			...typeof enableTypeScript !== 'boolean'
				? enableTypeScript
				: {},
			componentExts,
			overrides: overrides.typescript,
		}));
	}

	if (stylisticOptions)
		configs.push(stylistic(stylisticOptions));

	if (options.test ?? true)
		configs.push(test({ isInEditor, overrides: overrides.test }));

	if (enableJest)
		configs.push(jest({ isInEditor, overrides: overrides.jest }));

	if (enableVue) {
		configs.push(vue({
			...typeof enableVue !== 'boolean'
				? enableVue
				: {},
			overrides: overrides.vue,
			stylistic: stylisticOptions,
			typescript: !!enableTypeScript,
		}));
	}

	if (enableAstro) {
		configs.push(astro({
			overrides: overrides.astro,
			typescript: !!enableTypeScript,
		}));
	}

	if (enableReact) {
		configs.push(react({
			overrides: overrides.react,
			typescript: !!enableTypeScript,
		}));
	}

	if (enableUnoCSS) {
		configs.push(unocss(
			typeof enableUnoCSS === 'boolean' ? {} : enableUnoCSS,
		));
	}

	if (options.jsonc ?? true) {
		configs.push(
			jsonc({
				overrides: overrides.jsonc,
				stylistic: stylisticOptions,
			}),
			sortPackageJson(),
			sortTsConfig(),
		);
	}

	if (options.yaml ?? true) {
		configs.push(yaml({
			overrides: overrides.yaml,
			stylistic: stylisticOptions,
		}));
	}

	if (options.toml ?? true) {
		configs.push(toml({
			overrides: overrides.toml,
			stylistic: stylisticOptions,
		}));
	}

	if (options.markdown ?? true) {
		configs.push(markdown({
			componentExts,
			overrides: overrides.markdown,
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
