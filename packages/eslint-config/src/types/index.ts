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

export interface OptionsVue extends OptionsOverrides {
	/**
	 * Create virtual files for Vue SFC blocks to enable linting.
	 *
	 * Requires installing:
	 * `eslint-processor-vue-blocks`
	 *
	 * @see [`eslint-processor-vue-blocks` github](https://github.com/antfu/eslint-processor-vue-blocks)
	 * @default true
	 */
	sfcBlocks?: boolean | import('eslint-processor-vue-blocks').Options;

	/**
	 * Vue version. Apply different rules set from `eslint-plugin-vue`
	 *
	 * @see https://eslint.vuejs.org/rules/
	 * @default 3
	 */
	vueVersion?: 2 | 3;

	/**
	 * Enable Vue accessibility rules.
	 *
	 * Requires installing:
	 * - `eslint-plugin-vuejs-accessibility`
	 *
	 * @see https://github.com/vue-a11y/eslint-plugin-vuejs-accessibility
	 * @default false
	 */
	accessibility?: boolean;
}

export interface OptionsGitignore {
	/**
	 * Path to `.gitignore` files, or files with compatible formats like `.eslintignore`.
	 *
	 * @default [`${CWD}.gitignore`]
	 */
	files?: string[];

	/**
	 * Throws an error if gitignore file isn't found.
	 *
	 * @default true
	 */
	strict?: boolean;

	/**
	 * Mark the current working directory as the root directory,
	 * disable searching for `.gitignore` files in parent directories.
	 *
	 * This option is not effective when `files` is explicitly specified.
	 *
	 * @default false
	 */
	root?: boolean;
}

export interface OptionsFormatters {
	/**
	 * Enable formatting support for CSS, Less, Sass, and SCSS
	 *
	 * Currently only supports Prettier.
	 *
	 * @default true
	 */
	css?: 'prettier' | boolean;

	/**
	 * Enable formatting support for HTML.
	 *
	 * Currently only supports Prettier.
	 *
	 * @default true
	 */
	html?: 'prettier' | boolean;

	/**
	 * Enable formatting support for XML.
	 *
	 * Requires installing:
	 * - `@prettier/plugin-xml`
	 *
	 * Currently only supports Prettier.
	 *
	 * @default auto-detect based on the dependencies
	 */
	xml?: 'prettier' | boolean;

	/**
	 * Enable formatting support for SVG.
	 *
	 * Requires installing:
	 * - `@prettier/plugin-xml`
	 *
	 * Currently only supports Prettier.
	 *
	 * @default auto-detect based on the dependencies
	 */
	svg?: 'prettier' | boolean;

	/**
	 * Enable formatting support for Markdown.
	 *
	 * Supports both Prettier and dprint.
	 *
	 * When set to `true`, it will use Prettier.
	 *
	 * @default true
	 */
	markdown?: 'prettier' | 'dprint' | boolean;

	/**
	 * Enable formatting support for GraphQL.
	 *
	 * Currently only works with Prettier.
	 *
	 * @default true
	 */
	graphql?: 'prettier' | boolean;

	/**
	 * Custom options for Prettier.
	 *
	 * By default it's controlled by our own config.
	 *
	 * @default {}
	 */
	prettierOptions?: import('./prettier').VendoredPrettierOptions;

	/**
	 * Custom options for dprint.
	 *
	 * By default it's controlled by our own config.
	 */
	dprintOptions?: boolean;

	/**
	 * Install the prettier plugin for handle Slidev markdown
	 *
	 * Requires installing:
	 * - `prettier-plugin-slidev`
	 *
	 * Only works when `markdown` is enabled with `prettier`.
	 *
	 * @default auto-detect based on the dependencies
	 */
	slidev?: boolean | {
		files?: string[];
	};

	/**
	 * Enable formatting support for Astro.
	 *
	 * Requires installing:
	 * - `prettier-plugin-astro`
	 *
	 * Currently only support Prettier.
	 *
	 * @default auto-detect based on the dependencies
	 */
	astro?: 'prettier' | boolean;
}

export interface OptionsFiles {
	/**
	 * Override the `files` options to provide custom globs.
	 *
	 * @default []
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

export interface OptionsTypeScriptParserOptions extends OptionsOverrides {
	/**
	 * Additional parser options for TypeScript.
	 *
	 * @see https://typescript-eslint.io/packages/parser
	 */
	parserOptions?: Partial<import('@typescript-eslint/parser').ParserOptions>;

	/**
	 * Glob patterns for files that should be type aware.
	 *
	 * @see https://typescript-eslint.io/getting-started/typed-linting
	 * @default ['**\/*.{ts,tsx}']
	 */
	filesTypeAware?: string[];

	/**
	 * Glob patterns for files that should not be type aware.
	 *
	 * @see https://typescript-eslint.io/getting-started/typed-linting
	 * @default ['**\/*.md\/**', '**\/*.astro/*.ts']
	 */
	ignoresTypeAware?: string[];
}

export interface OptionsTypeScriptWithTypes extends OptionsOverrides {
	/**
	 * When this options is provided, type aware rules will be enabled.
	 *
	 * @see https://typescript-eslint.io/getting-started/typed-linting
	 * @default undefined
	 */
	tsconfigPath?: string | string[];

	/**
	 * Type-aware verrides for TypeScript.
	 *
	 * @default {} the default ruleset, with the overrides being applied last
	 */
	overridesTypeAware?: TypedFlatConfigItem['rules'];
}

export interface OptionsHasTypeScript {
	/**
	 * Whether or not TypeScript is enabled.
	 *
	 * @default auto-detect (passed in through context)
	 */
	typescript?: boolean;
}

export interface OptionsStylistic {
	/**
	 * The stylistic config if enabled.
	 *
	 * @default preset defaults for stylistic
	 */
	stylistic?: boolean | StylisticConfig;
}

export interface StylisticConfig extends Pick<
	import('@stylistic/eslint-plugin').StylisticCustomizeOptions,
	'indent' | 'quotes' | 'jsx' | 'semi'
>, OptionsOverrides { }

export interface OptionsOverrides {
	/**
	 * Overrides for this Ruleset.
	 *
	 * @default {} the default ruleset, with the overrides being applied last
	 */
	overrides?: TypedFlatConfigItem['rules'];
}

export interface OptionsProjectType {
	/**
	 * Type of the project. `'lib'` will enable more strict rules for libraries.
	 *
	 * @default 'app'
	 */
	type?: 'app' | 'lib';
}

export interface OptionsIsInEditor {
	/**
	 * Control to disable some testing rules in editors.
	 *
	 * @default auto-detect based on the process.env
	 */
	isInEditor?: boolean;
}

export interface OptionsRegExp extends OptionsOverrides {
	/**
	 * Override RegExp rule levels
	 *
	 * @default 'error'
	 */
	level?: 'error' | 'warn';
}

export interface OptionsUnoCSS extends OptionsOverrides {
	/**
	 * Enable attributify support.
	 *
	 * @see https://unocss.dev/integrations/eslint#rules
	 * @default true
	 */
	attributify?: boolean;

	/**
	 * Enable strict mode (throws errors about blocked classes)
	 *
	 * @see https://unocss.dev/integrations/eslint#unocss-blocklist
	 * @default false
	 */
	strict?: boolean;
}

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
	javascript?: OptionsOverrides;

	/**
	 * Enable TypeScript support.
	 *
	 * Passing an object to enable TypeScript Language Server support.
	 *
	 * @see https://typescript-eslint.io/
	 * @default auto-detect based on the dependencies
	 */
	typescript?: boolean | OptionsTypeScriptWithTypes | OptionsTypeScriptParserOptions;

	/**
	 * Enable JSX related rules. Currently only stylistic rules are included.
	 *
	 * @default true
	 */
	jsx?: boolean;

	/**
	 * Enable Vitest support.
	 *
	 * @see https://github.com/vitest-dev/eslint-plugin-vitest
	 * @default true
	 */
	test?: boolean | OptionsOverrides;

	/**
	 * Enable Tanstack Query support.
	 *
	 * Requires installing:
	 * - `@tanstack/eslint-plugin-query`
	 *
	 * @see https://tanstack.com/query/latest/docs/eslint/eslint-plugin-query
	 * @default auto-detect based on the dependencies
	 */
	query?: boolean | OptionsOverrides;

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
	solid?: boolean | OptionsOverrides;

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
	react?: boolean | OptionsOverrides;

	/**
	 * Enable svelte rules.
	 *
	 * Requires installing:
	 * - `eslint-plugin-svelte`
	 *
	 * @see https://github.com/sveltejs/eslint-plugin-svelte
	 * @default auto-detect based on the dependencies
	 */
	svelte?: boolean | OptionsOverrides;

	/**
	 * Enable Astro support.
	 *
	 * Requires installing:
	 * - `eslint-plugin-astro`
	 *
	 * @see https://ota-meshi.github.io/eslint-plugin-astro/
	 * @default auto-detect based on the dependencies
	 */
	astro?: boolean | OptionsOverrides;

	/**
	 * Enable JSONC support.
	 *
	 * @see https://ota-meshi.github.io/eslint-plugin-jsonc/
	 * @default true
	 */
	jsonc?: boolean | OptionsOverrides;

	/**
	 * Enable YAML support.
	 *
	 * @see https://ota-meshi.github.io/eslint-plugin-yml/
	 * @default true
	 */
	yaml?: boolean | OptionsOverrides;

	/**
	 * Enable TOML support.
	 *
	 * @see https://ota-meshi.github.io/eslint-plugin-toml/
	 * @default true
	 */
	toml?: boolean | OptionsOverrides;

	/**
	 * Enable JSON schema validation support.
	 *
	 * Requires installing:
	 * - `eslint-plugin-json-schema-validator`
	 *
	 * @see https://ota-meshi.github.io/eslint-plugin-json-schema-validator/
	 * @default false
	 */
	schema?: boolean | OptionsOverrides;

	/**
	 * Enable linting for **code snippets** in Markdown.
	 *
	 * For formatting Markdown content, enable also `formatters.markdown`
	 *
	 * @see https://github.com/eslint/markdown
	 * @default true
	 */
	markdown?: boolean | OptionsOverrides;

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
