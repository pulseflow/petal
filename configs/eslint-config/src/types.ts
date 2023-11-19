import type { FlatGitignoreOptions } from 'eslint-config-flat-gitignore';
import type { ParserOptions } from '@typescript-eslint/parser';
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
import type { Rules as PetalRules } from '@flowr/eslint-plugin-petal';
import type { StylisticCustomizeOptions, UnprefixedRuleOptions as StylisticRules } from '@stylistic/eslint-plugin';

export type WrapRuleConfig<T extends { [key: string]: any }> = {
	[K in keyof T]: T[K] extends RuleConfig ? T[K] : RuleConfig<T[K]>;
};

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

export type ConfigItem = Omit<FlatESLintConfigItem<Rules, false>, 'plugins'> & {
	/**
	 * Custom name of each config item.
	 */
	name?: string

	/**
	 * An object containing a name-value mapping of plugin names to plugin objects.
	 */
	plugins?: Record<string, any>
};

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
	overrides?: ConfigItem['rules']
}

export interface OptionsIsInEditor {
	isInEditor?: boolean
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
	vue?: boolean

	/**
	 * Enable React support.
	 *
	 * @default auto-detect based on the dependencies
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
	 * Enable Markdown support.
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
	 * Control to disable some rules in editors.
	 * @default auto-detect based on the process.env
	 */
	isInEditor?: boolean

	/**
	 * Provide overrides for rules for each integration.
	 */
	overrides?: {
		javascript?: ConfigItem['rules']
		typescript?: ConfigItem['rules']
		test?: ConfigItem['rules']
		jest?: ConfigItem['rules']
		vue?: ConfigItem['rules']
		react?: ConfigItem['rules']
		astro?: ConfigItem['rules']
		jsonc?: ConfigItem['rules']
		markdown?: ConfigItem['rules']
		yaml?: ConfigItem['rules']
	}
}
