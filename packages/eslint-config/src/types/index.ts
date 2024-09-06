import type { OptionsAstro } from './configs/astro';
import type { OptionsComponentExts } from './configs/components';
import type { OptionsProjectType } from './configs/editor';
import type { OptionsJsonc, OptionsToml, OptionsYaml } from './configs/formats';
import type { OptionsFormatters } from './configs/formatters';
import type { OptionsGitignore } from './configs/gitignore';
import type { OptionsJavascript } from './configs/javascript';
import type { OptionsMarkdown } from './configs/markdown';
import type { OptionsQuery } from './configs/query';
import type { OptionsReact } from './configs/react';
import type { OptionsRegExp } from './configs/regexp';
import type { OptionsSchema } from './configs/schema';
import type { OptionsSolid } from './configs/solid';
import type { StylisticConfig } from './configs/stylistic';
import type { OptionsSvelte } from './configs/svelte';
import type { OptionsTest } from './configs/test';
import type { OptionsTypeScript } from './configs/typescript';
import type { OptionsUnicorn } from './configs/unicorn';
import type { OptionsUnoCSS } from './configs/unocss';
import type { OptionsVue } from './configs/vue';

export type * from './configs';
export type * from './prettier';

export type Awaitable<T> = T | Promise<T>;
export type Rules = import('./typegen').RuleOptions;
export type { ConfigNames } from './typegen';

type InternalFlatConfig = import('eslint').Linter.Config<import('eslint').Linter.RulesRecord & Rules>;

export type TypedFlatConfigItem = Omit<InternalFlatConfig, 'plugins'> & {
	/**
	 * An object containing a name-value mapping of plugin names to plugin objects.
	 * For now, these types are simply a relaxed `Record<string, any>`, but in the future they will use a strict ESLint plugin type.
	 *
	 * @see [Using plugins in your configuration](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#using-plugins-in-your-configuration)
	 */
	plugins?: Record<string, any>;
};

export interface OptionsConfig extends OptionsComponentExts, OptionsProjectType {
	/**
	 * Enable gitignore support.
	 *
	 * Passing an object to configure the options.
	 *
	 * @default true
	 */
	gitignore?: boolean | OptionsGitignore;

	/**
	 * Enable opinionated stylistic rules.
	 *
	 * @default true
	 */
	opinionated?: boolean;

	/**
	 * Core JavaScript rules. Can't be disabled.
	 *
	 * @default {}
	 */
	javascript?: OptionsJavascript;

	/**
	 * Enable TypeScript support.
	 *
	 * Passing an object to enable TypeScript Language Server support.
	 *
	 * @see https://typescript-eslint.io/
	 * @default auto-detect based on the dependencies
	 */
	typescript?: boolean | OptionsTypeScript;

	/**
	 * Enable JSX related rules. Currently only stylistic rules are included.
	 *
	 * @default true
	 */
	jsx?: boolean;

	/**
	 * Enable `eslint-plugin-unicorn` support.
	 *
	 * @see https://github.com/sindresorhus/eslint-plugin-unicorn
	 * @default true
	 */
	unicorn?: boolean | OptionsUnicorn;

	/**
	 * Enable Vitest support.
	 *
	 * @see https://github.com/vitest-dev/eslint-plugin-vitest
	 * @default true
	 */
	test?: boolean | OptionsTest;

	/**
	 * Enable Tanstack Query support.
	 *
	 * Requires installing:
	 * - `@tanstack/eslint-plugin-query`
	 *
	 * @see https://tanstack.com/query/latest/docs/eslint/eslint-plugin-query
	 * @default auto-detect based on the dependencies
	 */
	query?: boolean | OptionsQuery;

	/**
	 * Enable Vue support.
	 *
	 * Requires installing:
	 * - `eslint-plugin-vue`
	 * - `eslint-processor-vue-blocks`
	 *
	 * @see https://eslint.vuejs.org/
	 * @see https://github.com/antfu/eslint-processor-vue-blocks
	 * @default auto-detect based on the dependencies
	 */
	vue?: boolean | OptionsVue;

	/**
	 * Enable Solid support.
	 *
	 * @see https://github.com/solidjs-community/eslint-plugin-solid
	 * @default auto-detect based on the dependencies
	 */
	solid?: boolean | OptionsSolid;

	/**
	 * Enable React rules.
	 *
	 * Requires installing:
	 * - `@eslint-react/eslint-plugin`
	 * - `eslint-plugin-react-hooks`
	 *
	 * @see https://eslint-react.xyz/
	 * @see https://www.npmjs.com/package/eslint-plugin-react-hooks
	 * @default auto-detect based on the dependences
	 */
	react?: boolean | OptionsReact;

	/**
	 * Enable svelte rules.
	 *
	 * Requires installing:
	 * - `eslint-plugin-svelte`
	 *
	 * @see https://github.com/sveltejs/eslint-plugin-svelte
	 * @default auto-detect based on the dependencies
	 */
	svelte?: boolean | OptionsSvelte;

	/**
	 * Enable Astro support.
	 *
	 * Requires installing:
	 * - `eslint-plugin-astro`
	 *
	 * @see https://ota-meshi.github.io/eslint-plugin-astro/
	 * @default auto-detect based on the dependencies
	 */
	astro?: boolean | OptionsAstro;

	/**
	 * Enable JSONC support.
	 *
	 * @see https://ota-meshi.github.io/eslint-plugin-jsonc/
	 * @default true
	 */
	jsonc?: boolean | OptionsJsonc;

	/**
	 * Enable YAML support.
	 *
	 * @see https://ota-meshi.github.io/eslint-plugin-yml/
	 * @default true
	 */
	yaml?: boolean | OptionsYaml;

	/**
	 * Enable TOML support.
	 *
	 * @see https://ota-meshi.github.io/eslint-plugin-toml/
	 * @default true
	 */
	toml?: boolean | OptionsToml;

	/**
	 * Enable JSON schema validation support.
	 *
	 * @see https://ota-meshi.github.io/eslint-plugin-json-schema-validator/
	 * @default true
	 */
	schema?: boolean | OptionsSchema;

	/**
	 * Enable linting for **code snippets** in Markdown.
	 *
	 * For formatting Markdown content, enable also `formatters.markdown`
	 *
	 * @see https://github.com/eslint/markdown
	 * @default true
	 */
	markdown?: boolean | OptionsMarkdown;

	/**
	 * Enable stylistic rules.
	 *
	 * @see https://eslint.style
	 * @default true
	 */
	stylistic?: boolean | StylisticConfig;

	/**
	 * Enable regexp rules
	 *
	 * @see https://ota-meshi.github.io/eslint-plugin-regexp/
	 * @default true
	 */
	regexp?: boolean | OptionsRegExp;

	/**
	 * Enable UnoCSS rules.
	 *
	 * Requires installing:
	 * - `@unocss/eslint-plugin`
	 *
	 * @see https://unocss.dev/integrations/eslint
	 * @default false
	 */
	unocss?: boolean | OptionsUnoCSS;

	/**
	 * Use external formatters to format files.
	 *
	 * Requires installing:
	 * - `eslint-plugin-format`
	 *
	 * When set to `true`, it will enable all formatters by default.
	 * Use `OptionsFormatters` to fine-tune the formatters and config options.
	 *
	 * @see https://github.com/antfu/eslint-plugin-format
	 * @default false
	 */
	formatters?: boolean | OptionsFormatters;

	/**
	 * Control to disable some testing rules in editors.
	 *
	 * @default auto-detect based on the process.env
	 */
	isInEditor?: boolean;

	/**
	 * Automatically rename plugins in the config.
	 *
	 * @default true
	 */
	autoRenamePlugins?: boolean;
}
