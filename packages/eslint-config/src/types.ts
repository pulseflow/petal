import type { FlatGitignoreOptions } from 'eslint-config-flat-gitignore';
import type { ParserOptions } from '@typescript-eslint/parser';
import type { Options as VueBlocksOptions } from 'eslint-processor-vue-blocks';
import type { Linter } from 'eslint';
import type { StylisticCustomizeOptions } from '@stylistic/eslint-plugin';
import type { VendoredPrettierOptions } from './vendor/prettier-types';
import type { ConfigNames, RuleOptions } from './typegen';

export type Awaitable<T> = T | Promise<T>;

export type Rules = RuleOptions;

export type { ConfigNames };

export type TypedFlatConfigItem = Omit<Linter.FlatConfig<Linter.RulesRecord & Rules>, 'plugins'> & {
	/**
	 * An object containing a name-value mapping of plugin names to plugin objects.
	 * For now, these types are simply a relaxed `Record<string, any>`, but in the future they will use a strict ESLint plugin type.
	 *
	 * @see [Using plugins in your configuration](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#using-plugins-in-your-configuration)
	 */
	plugins?: Record<string, any>;
};

export interface OptionsVue extends OptionsOverrides {
	/**
	 * Create virtual files for Vue SFC blocks to enable linting.
	 *
	 * @see https://github.com/antfu/eslint-processor-vue-blocks
	 * @default true
	 */
	sfcBlocks?: boolean | VueBlocksOptions;

	/**
	 * Vue version. Apply different rules set from `eslint-plugin-vue`
	 *
	 * @default 3
	 */
	vueVersion?: 2 | 3;
}

export type OptionsTypescript =
	(OptionsTypeScriptWithTypes & OptionsOverrides)
	| (OptionsTypeScriptParserOptions & OptionsOverrides);

export interface OptionsFormatters {
	/**
	 * Enable formatting support for CSS, Less, Sass, and SCSS
	 *
	 * Currently only supports Prettier.
	 */
	css?: 'prettier' | boolean;

	/**
	 * Enable formatting support for HTML.
	 *
	 * Currently only supports Prettier.
	 */
	html?: 'prettier' | boolean;

	/**
	 * Enable formatting support for XML.
	 *
	 * Currently only support Prettier.
	 */
	xml?: 'prettier' | boolean;

	/**
	 * Enable formatting support for Markdown.
	 *
	 * Supports both Prettier and dprint.
	 *
	 * When set to `true`, it will use Prettier.
	 */
	markdown?: 'prettier' | 'dprint' | boolean;

	/**
	 * Enable formatting support for GraphQL.
	 */
	graphql?: 'prettier' | boolean;

	/**
	 * Custom options for Prettier.
	 *
	 * By default it's controlled by our own config.
	 */
	prettierOptions?: VendoredPrettierOptions;

	/**
	 * Custom options for dprint.
	 *
	 * By default it's controlled by out own config.
	 */
	dprintOptions?: boolean;

	/**
	 * Install the prettier plugin for handle Slidev markdown
	 *
	 * Only works when `markdown` is enabled with `prettier`.
	 */
	slidev?: boolean | {
		files?: string[];
	};

	/**
	 * Enable formatting support for Astro.
	 *
	 * Currently only support Prettier.
	 */
	astro?: 'prettier' | boolean;
}

export interface OptionsFiles {
	/**
	 * Override the `files` options to provide custom globs.
	 */
	files?: string[];
}

export interface OptionsComponentExts {
	/**
	 * Additional extensions for components.
	 *
	 * @example ['vue']
	 * @default []
	 */
	componentExts?: string[];
}

export interface OptionsTypeScriptParserOptions {
	/**
	 * Additional parser options for TypeScript.
	 */
	parserOptions?: Partial<ParserOptions>;

	/**
	 * Glob patterns for files that should be type aware.
	 * @default ['**\/*.{ts,tsx}']
	 */
	filesTypeAware?: string[];
}

export interface OptionsTypeScriptWithTypes {
	/**
	 * When this options is provided, type aware rules will be enabled.
	 * @see https://typescript-eslint.io/linting/typed-linting/
	 */
	tsconfigPath?: string | string[];
}

export interface OptionsHasTypeScript {
	typescript?: boolean;
}

export interface OptionsStylistic {
	stylistic?: boolean | StylisticConfig;
}

export interface StylisticConfig extends Pick<StylisticCustomizeOptions, 'indent' | 'quotes' | 'jsx' | 'semi'> { }

export interface OptionsOverrides {
	overrides?: TypedFlatConfigItem['rules'];
}

export interface OptionsIsInEditor {
	isInEditor?: boolean;
}

export interface OptionsRegExp {
	/** Override rulelevels */
	level?: 'error' | 'warn';
}

export interface OptionsUnoCSS extends OptionsOverrides {
	/**
	 * Enable attributify support.
	 *
	 * @default true
	 */
	attributify?: boolean;

	/**
	 * Enable strict mode (throws errors about blocked classes)
	 *
	 * @default false
	 */
	strict?: boolean;
}

export interface OptionsConfig extends OptionsComponentExts {
	/**
	 * Enable gitignore support.
	 *
	 * Passing an object to configure the options.
	 *
	 * @see https://github.com/antfu/eslint-config-flat-gitignore
	 * @default true
	 */
	gitignore?: boolean | FlatGitignoreOptions;

	/**
	 * Enable opinionated stylistic rules.
	 *
	 * @default true
	 */
	opinionated?: boolean;

	/**
	 * Core rules. Can't be disabled.
	 */
	javascript?: OptionsOverrides;

	/**
	 * Enable TypeScript support.
	 *
	 * Passing an object to enable TypeScript Language Server support.
	 *
	 * @default auto-detect based on the dependencies
	 */
	typescript?: boolean | OptionsTypescript;

	/**
	 * Enable JSX related rules.
	 *
	 * Currently only stylistic rules are included.
	 *
	 * @default true
	 */
	jsx?: boolean;

	/**
	 * Enable test support.
	 *
	 * @default true
	 */
	test?: boolean | OptionsOverrides;

	/**
	 * Enable Vue support.
	 *
	 * @default auto-detect based on the dependencies
	 */
	vue?: boolean | OptionsVue;

	/**
	 * Enable Solid support.
	 *
	 * @default auto-detect based on the dependencies
	 */
	solid?: boolean | OptionsOverrides;

	/**
	 * Enable React rules.
	 *
	 * Requires installing:
	 * - `@eslint-react/eslint-plugin`
	 * - `eslint-plugin-react-hooks`
	 * - `eslint-plugin-react-refresh`
	 *
	 * @default false
	 */
	react?: boolean | OptionsOverrides;

	/**
	 * Enable svelte rules.
	 *
	 * Requires installing:
	 * - `eslint-plugin-svelte`
	 *
	 * @default false
	 */
	svelte?: boolean;

	/**
	 * Enable Astro support.
	 *
	 * @default auto-detect based on the dependencies
	 */
	astro?: boolean;

	/**
	 * Enable JSONC support.
	 *
	 * @default true
	 */
	jsonc?: boolean | OptionsOverrides;

	/**
	 * Enable YAML support.
	 *
	 * @default true
	 */
	yaml?: boolean | OptionsOverrides;

	/**
	 * Enable TOML support.
	 *
	 * @default true
	 */
	toml?: boolean | OptionsOverrides;

	/**
	 * Enable linting for **code snippets** in Markdown.
	 *
	 * For formatting Markdown content, enable also `formatters.markdown`
	 *
	 * @default true
	 */
	markdown?: boolean | OptionsOverrides;

	/**
	 * Enable stylistic rules.
	 *
	 * @see https://eslint.style
	 * @default true
	 */
	stylistic?: boolean | (StylisticConfig & OptionsOverrides);

	/**
	 * Enable regexp rules
	 *
	 * @see https://ota-meshi.github.io/eslint-plugin-regexp/
	 * @default true
	 */
	regexp?: boolean | (OptionsRegExp & OptionsOverrides);

	/**
	 * Enable UnoCSS rules.
	 *
	 * Requires installing:
	 * - `@unocss/eslint-plugin`
	 *
	 * @default false
	 */
	unocss?: boolean | OptionsUnoCSS;

	/**
	 * Use external formatters to format files.
	 *
	 * Requires installing:
	 * - `eslint-plugin-format`
	 *
	 * When set to `true`, it will enable all formatters.
	 *
	 * @default false
	 */
	formatters?: boolean | OptionsFormatters;

	/**
	 * Control to disable some rules in editors.
	 * @default auto-detect based on the process.env
	 */
	isInEditor?: boolean;

	/**
	 * Automatically rename plugins in the config.
	 *
	 * @default true
	 */
	autoRenamePlugins?: boolean;

	/**
	 * Provide overrides for rules for each integration.
	 *
	 * @deprecated since 2.3.0 use `overrides` option in each integration key instead
	 */
	overrides?: {
		stylistic?: TypedFlatConfigItem['rules'];
		javascript?: TypedFlatConfigItem['rules'];
		typescript?: TypedFlatConfigItem['rules'];
		test?: TypedFlatConfigItem['rules'];
		vue?: TypedFlatConfigItem['rules'];
		solid?: TypedFlatConfigItem['rules'];
		react?: TypedFlatConfigItem['rules'];
		astro?: TypedFlatConfigItem['rules'];
		jsonc?: TypedFlatConfigItem['rules'];
		toml?: TypedFlatConfigItem['rules'];
		markdown?: TypedFlatConfigItem['rules'];
		yaml?: TypedFlatConfigItem['rules'];
		svelte?: TypedFlatConfigItem['rules'];
	};
}
