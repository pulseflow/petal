import { isPackageExists } from 'local-pkg';
import { GLOB_ASTRO, GLOB_CSS, GLOB_GRAPHQL, GLOB_HTML, GLOB_LESS, GLOB_MARKDOWN, GLOB_POSTCSS, GLOB_SCSS } from '../globs.js';
import type { VendoredPrettierOptions } from '../vendor/prettier-types.js';
import { ensurePackages, interopDefault, parserPlain } from '../utils.js';
import type { OptionsFormatters, StylisticConfig, TypedFlatConfigItem } from '../types.js';
import { StylisticConfigDefaults } from './stylistic.js';

export async function formatters(options: OptionsFormatters | true = {}, stylistic: StylisticConfig = {}): Promise<TypedFlatConfigItem[]> {
	if (options === true) {
		options = {
			astro: isPackageExists('astro'),
			css: true,
			graphql: true,
			html: true,
			markdown: true,
			slidev: isPackageExists('@slidev/cli'),
		};
	}

	await ensurePackages([
		'eslint-plugin-format',
		options.markdown && options.slidev ? 'prettier-plugin-slidev' : undefined,
		options.astro ? 'prettier-plugin-astro' : undefined,
	]);

	if (options.slidev && options.markdown !== true && options.markdown !== 'prettier')
		throw new Error('`slidev` option only works when `markdown` is enabled with `prettier`');

	const { indent, quotes, semi } = { ...StylisticConfigDefaults, ...stylistic };

	const prettierOptions: VendoredPrettierOptions = Object.assign({
		endOfLine: 'auto',
		semi,
		singleQuote: quotes === 'single',
		tabWidth: typeof indent === 'number' ? indent : 2,
		trailingComma: 'all',
		useTabs: indent === 'tab',
	} satisfies VendoredPrettierOptions, options.prettierOptions || {});

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

	if (options.css) {
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
						{
							...prettierOptions,
							parser: 'css',
						},
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
						{
							...prettierOptions,
							parser: 'scss',
						},
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
						{
							...prettierOptions,
							parser: 'less',
						},
					],
				},
			},
		);
	}

	if (options.html) {
		configs.push({
			files: [GLOB_HTML],
			languageOptions: {
				parser: parserPlain,
			},
			name: 'petal/formatter/html',
			rules: {
				'format/prettier': [
					'error',
					{
						...prettierOptions,
						parser: 'html',
					},
				],
			},
		});
	}

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
						? {
								printWidth: 120,
								...prettierOptions,
								embeddedLanguageFormatting: 'off',
								parser: 'markdown',
							}
						: {
								...dprintOptions,
								language: 'markdown',
							},
				],
			},
		});

		if (options.slidev) {
			configs.push({
				files: GLOB_SLIDEV,
				languageOptions: {
					parser: parserPlain,
				},
				name: 'petal/formatter/slidev',
				rules: {
					'format/prettier': [
						'error',
						{
							printWidth: 120,
							...prettierOptions,
							embeddedLannguageFormatting: 'off',
							parser: 'slidev',
							plugins: ['prettier-plugin-slidev'],
						},
					],
				},
			});
		}
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
					{
						...prettierOptions,
						parser: 'astro',
						plugins: ['prettier-plugin-astro'],
					},
				],
			},
		});
	}

	if (options.graphql) {
		configs.push({
			files: [GLOB_GRAPHQL],
			languageOptions: {
				parser: parserPlain,
			},
			name: 'petal/formatter/graphql',
			rules: {
				'format/prettier': [
					'error',
					{
						...prettierOptions,
						parser: 'graphql',
					},
				],
			},
		});
	}

	return configs;
}
