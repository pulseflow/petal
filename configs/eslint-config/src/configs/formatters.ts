import { GLOB_CSS, GLOB_LESS, GLOB_MARKDOWN, GLOB_POSTCSS, GLOB_SCSS } from '../globs.js';
import type { VendoredPrettierOptions } from '../vendor/prettier-types.js';
import { ensurePackages, interopDefault, parserPlain } from '../utils.js';
import type { FlatConfigItem, OptionsFormatters, StylisticConfig } from '../types.js';
import { StylisticConfigDefaults } from './stylistic.js';

export async function formatters(options: OptionsFormatters | true = {}, stylistic: StylisticConfig = {}): Promise<FlatConfigItem[]> {
	await ensurePackages(['eslint-plugin-format']);

	if (options === true) {
		options = {
			css: true,
			graphql: true,
			html: true,
			markdown: true,
		};
	}

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

	const configs: FlatConfigItem[] = [
		{
			name: 'petal:formatters:setup',
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
				name: 'petal:formatter:css',
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
				name: 'petal:formatter:scss',
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
				name: 'petal:formatter:less',
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
			files: ['**/*.html'],
			languageOptions: {
				parser: parserPlain,
			},
			name: 'petal:formatter:html',
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

		configs.push({
			files: [GLOB_MARKDOWN],
			languageOptions: {
				parser: parserPlain,
			},
			name: 'petal:formatter:markdown',
			rules: {
				[`format/${formatter}`]: [
					'error',
					formatter === 'prettier'
						? {
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
	}

	if (options.graphql) {
		configs.push({
			files: ['**/*.graphql'],
			languageOptions: {
				parser: parserPlain,
			},
			name: 'petal:formatter:graphql',
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
