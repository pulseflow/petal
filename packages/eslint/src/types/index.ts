import type { OptionsAstro } from './configs/astro.ts';
import type { OptionsComponentExts } from './configs/components.ts';
import type { OptionsProjectType } from './configs/editor.ts';
import type { OptionsJsonc, OptionsToml, OptionsYaml } from './configs/formats.ts';
import type { OptionsFormatters } from './configs/formatters.ts';
import type { OptionsGitignore } from './configs/gitignore.ts';
import type { OptionsJavaScript } from './configs/javascript.ts';
import type { OptionsMarkdown } from './configs/markdown.ts';
import type { OptionsQuery } from './configs/query.ts';
import type { OptionsReact } from './configs/react.ts';
import type { OptionsRegExp } from './configs/regexp.ts';
import type { OptionsSchema } from './configs/schema.ts';
import type { OptionsSolid } from './configs/solid.ts';
import type { StylisticConfig } from './configs/stylistic.ts';
import type { OptionsSvelte } from './configs/svelte.ts';
import type { OptionsTest } from './configs/test.ts';
import type { OptionsTypeScript } from './configs/typescript.ts';
import type { OptionsUnicorn } from './configs/unicorn.ts';
import type { OptionsUnoCSS } from './configs/unocss.ts';
import type { OptionsVue } from './configs/vue.ts';

export type * from './configs/index.ts';
export type * from './prettier.ts';

export type Awaitable<Type> = Type | Promise<Type>;
export type Rules = import('./typegen.d.ts').RuleOptions;
export type { ConfigNames } from './typegen.d.ts';

export type InternalFlatConfigItem = import('eslint').Linter.Config<import('eslint').Linter.RulesRecord & Rules>;
export interface TypedFlatConfigItem extends Omit<InternalFlatConfigItem, 'plugins'> {
	/**
	 * An object containing a name-value mapping of plugin names to plugin objects. When `files` is specified, these plugins are only available to the matching files.
	 *
	 * @see [Using plugins in your configuration](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#using-plugins-in-your-configuration)
	 *
	 * @remarks
	 *
	 * This is a relaxed plugins type limitation, as most of the plugins don't have correct type info yet.
	 * In the future, this will be limited to a TypeScript ESLint `Plugin` type.
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
	javascript?: OptionsJavaScript;

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
	 * @default false
	 */
	schema?: boolean | OptionsSchema;

	/**
	 * Enable linting for **code snippets** in Markdown.
	 *
	 * For formatting Markdown **content**, enable also `formatters.markdown`
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
