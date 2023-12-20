import type { FlatGitignoreOptions } from 'eslint-config-flat-gitignore';
import type { ParserOptions } from '@typescript-eslint/parser';
import type { Options as VueBlocksOptions } from 'eslint-processor-vue-blocks';
import type { Linter } from 'eslint';
import type {
	EslintCommentsRules,
	EslintRules,
	FlatESLintConfigItem,
	ImportRules,
	JsoncRules,
	JsxA11yRules,
	MergeIntersection,
	NRules,
	Prefix,
	ReactHooksRules,
	ReactRules,
	RenamePrefix,
	RuleConfig,
	VitestRules,
	VueRules,
	YmlRules,
} from '@antfu/eslint-define-config';
import type { RuleOptions as JSDocRules } from '@eslint-types/jsdoc/types';
import type { RuleOptions as TypeScriptRules } from '@eslint-types/typescript-eslint/types';
import type { RuleOptions as UnicornRules } from '@eslint-types/unicorn/types';
import type { Rules as PetalRules } from 'eslint-plugin-petal';
import type { StylisticCustomizeOptions, UnprefixedRuleOptions as StylisticRules } from '@stylistic/eslint-plugin';
import type { VendoredPrettierOptions } from './vendor/prettier-types.js';

export type WrapRuleConfig<T extends { [key: string]: any }> = {
	[K in keyof T]: T[K] extends RuleConfig ? T[K] : RuleConfig<T[K]>;
};

export type Awaitable<T> = T | Promise<T>;

export interface AstroRules {
	'astro/no-conflict-set-directives': string
	'astro/no-deprecated-astro-canonicalurl': string
	'astro/no-deprecated-astro-fetchcontent': string
	'astro/no-deprecated-astro-resolve': string
	'astro/no-deprecated-getentrybyslug': string
	'astro/no-unused-define-vars-in-style': string
	'astro/valid-compile': string
}

export interface JestRules { }

export type Rules = WrapRuleConfig<
	MergeIntersection<
		RenamePrefix<TypeScriptRules, '@typescript-eslint/', 'ts/'> &
		RenamePrefix<VitestRules, 'vitest/', 'test/'> &
		RenamePrefix<YmlRules, 'yml/', 'yaml/'> &
		RenamePrefix<NRules, 'n/', 'node/'> &
		Prefix<StylisticRules, 'style/'> &
		Prefix<PetalRules, 'petal/'> &
		JSDocRules &
		ImportRules &
		EslintRules &
		JsoncRules &
		VueRules &
		UnicornRules &
		EslintCommentsRules &
		JsxA11yRules &
		ReactHooksRules &
		AstroRules &
		ReactRules & { 'test/no-only-tests': RuleConfig<[]> }
	>
>;

export type FlatConfigItem = Omit<FlatESLintConfigItem<Rules, false>, 'plugins'> & {
	/**
	 * Custom name of each config item.
	 */
	name?: string

	/**
	 * An object containing a name-value mapping of plugin names to plugin objects.
	 */
	plugins?: Record<string, any>
};

export type UserConfigItem = FlatConfigItem | Linter.FlatConfig;

export interface OptionsVue {
	/**
	 * Create virtual files for Vue SFC blocks to enable linting.
	 *
	 * @see https://github.com/antfu/eslint-processor-vue-blocks
	 * @default true
	 */
	sfcBlocks?: boolean | VueBlocksOptions

	/**
	 * Vue version. Apply different rules set from `eslint-plugin-vue`
	 *
	 * @default 3
	 */
	vueVersion?: 2 | 3
}

export interface OptionsFormatters {
	/**
	 * Enable formatting support for CSS, Less, Sass, and SCSS
	 *
	 * Currently only supports Prettier.
	 */
	css?: 'prettier' | boolean

	/**
	 * Enable formatting support for HTML.
	 *
	 * Currently only supports Prettier.
	 */
	html?: 'prettier' | boolean

	/**
	 * Enable formatting support for Markdown.
	 *
	 * Supports both Prettier and dprint.
	 *
	 * When set to `true`, it will use Prettier.
	 */
	markdown?: 'prettier' | 'dprint' | boolean

	/**
	 * Enable formatting support for GraphQL.
	 */
	graphql?: 'prettier' | boolean

	/**
	 * Custom options for Prettier.
	 *
	 * By default it's controlled by our own config.
	 */
	prettierOptions?: VendoredPrettierOptions

	/**
	 * Custom options for dprint.
	 *
	 * By default it's controlled by out own config.
	 */
	dprintOptions?: boolean
}

export interface OptionsFiles {
	/**
	 * Override the `files` options to provide custom globs.
	 */
	files?: string[]
}

export interface OptionsComponentExts {
	/**
	 * Additional extensions for components.
	 *
	 * @example ['vue']
	 * @default []
	 */
	componentExts?: string[]
}

export interface OptionsTypeScriptParserOptions {
	/**
	 * Additional parser options for TypeScript.
	 */
	parserOptions?: Partial<ParserOptions>
}

export interface OptionsTypeScriptWithTypes {
	/**
	 * When this options is provided, type aware rules will be enabled.
	 * @see https://typescript-eslint.io/linting/typed-linting/
	 */
	tsconfigPath?: string | string[]
}

export interface OptionsHasTypeScript {
	typescript?: boolean
}

export interface OptionsStylistic {
	stylistic?: boolean | StylisticConfig
}

export interface StylisticConfig extends Pick<StylisticCustomizeOptions, 'indent' | 'quotes' | 'jsx' | 'semi'> { }

export interface OptionsOverrides {
	overrides?: FlatConfigItem['rules']
}

export interface OptionsIsInEditor {
	isInEditor?: boolean
}

export interface OptionsUnoCSS {
	/**
	 * Enable attributify support.
	 *
	 * @default true
	 */
	attributify?: boolean

	/**
	 * Enable strict mode (throws errors about blocked classes)
	 *
	 * @default false
	 */
	strict?: boolean
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
	gitignore?: boolean | FlatGitignoreOptions

	/**
	 * Enable TypeScript support.
	 *
	 * Passing an object to enable TypeScript Language Server support.
	 *
	 * @default auto-detect based on the dependencies
	 */
	typescript?:
		| boolean
		| OptionsTypeScriptWithTypes
		| OptionsTypeScriptParserOptions

	/**
	 * Enable JSX related rules.
	 *
	 * Currently only stylistic rules are included.
	 *
	 * @default true
	 */
	jsx?: boolean

	/**
	 * Enable test support.
	 *
	 * @default true
	 */
	test?: boolean

	/**
	 * Enable jest support.
	 *
	 * @default auto-detect based on the dependencies
	 */
	jest?: boolean

	/**
	 * Enable Vue support.
	 *
	 * @default auto-detect based on the dependencies
	 */
	vue?: boolean | OptionsVue

	/**
	 * Enable React rules.
	 *
	 * Requires installing:
	 * - `eslint-plugin-react`
	 * - `eslint-plugin-react-hooks`
	 * - `eslint-plugin-react-refresh`
	 *
	 * @default false
	 */
	react?: boolean

	/**
	 * Enable Astro support.
	 *
	 * @default auto-detect based on the dependencies
	 */
	astro?: boolean

	/**
	 * Enable JSONC support.
	 *
	 * @default true
	 */
	jsonc?: boolean

	/**
	 * Enable YAML support.
	 *
	 * @default true
	 */
	yaml?: boolean

	/**
	 * Enable TOML support.
	 *
	 * @default true
	 */
	toml?: boolean

	/**
	 * Enable linting for **code snippets** in Markdown.
	 *
	 * For formatting Markdown content, enable also `formatters.markdown`
	 *
	 * @default true
	 */
	markdown?: boolean

	/**
	 * Enable stylistic rules.
	 *
	 * @default true
	 */
	stylistic?: boolean | StylisticConfig

	/**
	 * Enable UnoCSS rules.
	 *
	 * Requires installing:
	 * - `@unocss/eslint-plugin`
	 *
	 * @default false
	 */
	unocss?: boolean | OptionsUnoCSS

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
	formatters?: boolean | OptionsFormatters

	/**
	 * Control to disable some rules in editors.
	 * @default auto-detect based on the process.env
	 */
	isInEditor?: boolean

	/**
	 * Provide overrides for rules for each integration.
	 */
	overrides?: {
		javascript?: FlatConfigItem['rules']
		typescript?: FlatConfigItem['rules']
		test?: FlatConfigItem['rules']
		jest?: FlatConfigItem['rules']
		vue?: FlatConfigItem['rules']
		react?: FlatConfigItem['rules']
		astro?: FlatConfigItem['rules']
		jsonc?: FlatConfigItem['rules']
		toml?: FlatConfigItem['rules']
		markdown?: FlatConfigItem['rules']
		yaml?: FlatConfigItem['rules']
	}
}
