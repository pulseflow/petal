import type { VendoredPrettierOptions } from '../prettier';

export type VendoredPrettierXMLOptions = Pick<VendoredPrettierOptions, 'xmlQuoteAttributes' | 'xmlSelfClosingSpace' | 'xmlSortAttributesByKey' | 'xmlWhitespaceSensitivity'>;

export interface PrettierConfigsOptions {
	defaultOptions: VendoredPrettierOptions;
	defaultXmlOptions: VendoredPrettierXMLOptions;
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
	 * @default undefined
	 */
	prettierOptions?: import('../prettier').VendoredPrettierOptions;

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
