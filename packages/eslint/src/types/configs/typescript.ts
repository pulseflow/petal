import type { TypedFlatConfigItem } from '../index';
import type { OptionsComponentExts } from './components';
import type { OptionsProjectType } from './editor';
import type { OptionsFiles } from './files';
import type { OptionsOverrides } from './overrides';

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

export type OptionsTypeScript = OptionsComponentExts &
	OptionsOverrides &
	OptionsTypeScriptWithTypes &
	OptionsTypeScriptParserOptions &
	OptionsProjectType &
	OptionsFiles;
