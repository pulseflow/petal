import type { OptionsFormatters, StylisticConfig, TypedFlatConfigItem, VendoredPrettierOptions, VendoredPrettierRuleOptions, VendoredPrettierXMLOptions } from '../types/index.ts';
import { isPackageExists } from 'local-pkg';
import { GLOB_ASTRO, GLOB_ASTRO_TS, GLOB_CSS, GLOB_GRAPHQL, GLOB_HTML, GLOB_LESS, GLOB_MARKDOWN, GLOB_POSTCSS, GLOB_SCSS, GLOB_SVG, GLOB_XML } from '../globs.ts';
import { ensurePackages, interopDefault, isPackageInScope, parserPlain } from '../utils.ts';
import { StylisticConfigDefaults } from './stylistic';

function mergePrettierOptions(
	options: VendoredPrettierOptions,
	overrides: VendoredPrettierRuleOptions = {},
): VendoredPrettierRuleOptions {
	return {
		...options,
		...overrides,
		plugins: [
			...overrides.plugins || [],
			...options.plugins || [],
		],
	};
}

export async function formatters(options: OptionsFormatters | true = {}, stylistic: StylisticConfig = {}): Promise<TypedFlatConfigItem[]> {
	const isXmlInScope = isPackageInScope('@prettier/plugin-xml');
	if (options === true)
		options = {
			astro: isPackageInScope('prettier-plugin-astro'),
			css: true,
			graphql: true,
			html: true,
			markdown: true,
			slidev: isPackageExists('@slidev/cli'),
			svg: isXmlInScope,
			xml: isXmlInScope,
		};

	await ensurePackages([
		'eslint-plugin-format',
		options.markdown && options.slidev ? 'prettier-plugin-slidev' : undefined,
		options.astro ? 'prettier-plugin-astro' : undefined,
		(options.xml || options.svg) ? '@prettier/plugin-xml' : undefined,
	]);

	if (options.slidev && options.markdown !== true && options.markdown !== 'prettier')
		throw new Error('the `slidev` option only works when `markdown` is enabled with `prettier`');

	const { indent, quotes, semi } = { ...StylisticConfigDefaults, ...stylistic };

	const prettierOptions: VendoredPrettierOptions = Object.assign({
		endOfLine: 'auto',
		printWidth: 120,
		semi,
		singleQuote: quotes === 'single',
		tabWidth: typeof indent === 'number' ? indent : 2,
		trailingComma: 'all',
		useTabs: indent === 'tab',
	} satisfies VendoredPrettierOptions, options.prettierOptions || {});

	const prettierXmlOptions: VendoredPrettierOptions = {
		xmlQuoteAttributes: 'double',
		xmlSelfClosingSpace: true,
		xmlSortAttributesByKey: false,
		xmlWhitespaceSensitivity: 'ignore',
	} satisfies VendoredPrettierXMLOptions;

	const dprintOptions = Object.assign({
		indentWidth: typeof indent === 'number' ? indent : 2,
		quoteStyle: quotes === 'single' ? 'preferSingle' : 'preferDouble',
		useTabs: indent === 'tab',
	}, options.dprintOptions || {});

	const pluginFormat = await interopDefault(import('eslint-plugin-format'));

	const configs: TypedFlatConfigItem[] = [
		{
			name: 'petal/formatter/setup',
			plugins: {
				format: pluginFormat,
			},
		},
	];

	if (options.css)
		configs.push(
			{
				files: [GLOB_CSS, GLOB_POSTCSS],
				languageOptions: {
					parser: parserPlain,
				},
				name: 'petal/formatter/css',
				rules: {
					'format/prettier': [
						'error',
						mergePrettierOptions(prettierOptions, {
							parser: 'css',
						}),
					],
				},
			},
			{
				files: [GLOB_SCSS],
				languageOptions: {
					parser: parserPlain,
				},
				name: 'petal/formatter/scss',
				rules: {
					'format/prettier': [
						'error',
						mergePrettierOptions(prettierOptions, {
							parser: 'scss',
						}),
					],
				},
			},
			{
				files: [GLOB_LESS],
				languageOptions: {
					parser: parserPlain,
				},
				name: 'petal/formatter/less',
				rules: {
					'format/prettier': [
						'error',
						mergePrettierOptions(prettierOptions, {
							parser: 'less',
						}),
					],
				},
			},
		);

	if (options.html)
		configs.push({
			files: [GLOB_HTML],
			languageOptions: {
				parser: parserPlain,
			},
			name: 'petal/formatter/html',
			rules: {
				'format/prettier': [
					'error',
					mergePrettierOptions(prettierOptions, {
						parser: 'html',
					}),
				],
			},
		});

	if (options.xml)
		configs.push({
			files: [GLOB_XML],
			languageOptions: {
				parser: parserPlain,
			},
			name: 'petal/formatter/xml',
			rules: {
				'format/prettier': [
					'error',
					mergePrettierOptions({ ...prettierXmlOptions, ...prettierOptions }, {
						parser: 'xml',
						plugins: ['@prettier/plugin-xml'],
					}),
				],
			},
		});

	if (options.svg)
		configs.push({
			files: [GLOB_SVG],
			languageOptions: {
				parser: parserPlain,
			},
			name: 'petal/formatter/svg',
			rules: {
				'format/prettier': [
					'error',
					mergePrettierOptions({ ...prettierXmlOptions, ...prettierOptions }, {
						parser: 'xml',
						plugins: ['@prettier/plugin-xml'],
					}),
				],
			},
		});

	if (options.markdown) {
		const formatter = options.markdown === true
			? 'prettier'
			: options.markdown;

		const GLOB_SLIDEV = !options.slidev
			? []
			: options.slidev === true
				? ['**/slides.md']
				: options.slidev.files;

		configs.push({
			files: [GLOB_MARKDOWN],
			ignores: GLOB_SLIDEV,
			languageOptions: {
				parser: parserPlain,
			},
			name: 'petal/formatter/markdown',
			rules: {
				[`format/${formatter}`]: [
					'error',
					formatter === 'prettier'
						? mergePrettierOptions(prettierOptions, {
								embeddedLanguageFormatting: 'off',
								parser: 'markdown',
							})
						: {
								...dprintOptions,
								language: 'markdown',
							},
				],
			},
		});

		if (options.slidev)
			configs.push({
				files: GLOB_SLIDEV,
				languageOptions: {
					parser: parserPlain,
				},
				name: 'petal/formatter/slidev',
				rules: {
					'format/prettier': [
						'error',
						mergePrettierOptions(prettierOptions, {
							embeddedLannguageFormatting: 'off',
							parser: 'slidev',
							plugins: ['prettier-plugin-slidev'],
						}),
					],
				},
			});
	}

	if (options.astro) {
		configs.push({
			files: [GLOB_ASTRO],
			languageOptions: {
				parser: parserPlain,
			},
			name: 'petal/formatter/astro',
			rules: {
				'format/prettier': [
					'error',
					mergePrettierOptions(prettierOptions, {
						parser: 'astro',
						plugins: ['prettier-plugin-astro'],
					}),
				],
			},
		});

		configs.push({
			files: [GLOB_ASTRO, GLOB_ASTRO_TS],
			name: 'petal/formatter/astro/disables',
			rules: {
				'style/arrow-parens': 'off',
				'style/block-spacing': 'off',
				'style/comma-dangle': 'off',
				'style/indent': 'off',
				'style/no-multi-spaces': 'off',
				'style/quotes': 'off',
				'style/semi': 'off',
			},
		});
	}

	if (options.graphql)
		configs.push({
			files: [GLOB_GRAPHQL],
			languageOptions: {
				parser: parserPlain,
			},
			name: 'petal/formatter/graphql',
			rules: {
				'format/prettier': [
					'error',
					mergePrettierOptions(prettierOptions, {
						parser: 'graphql',
					}),
				],
			},
		});

	return configs;
}
