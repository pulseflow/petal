import type {
	OptionsFiles,
	OptionsOverrides,
	OptionsStylistic,
	TypedFlatConfigItem,
} from '../types.js';
import { interopDefault } from '../utils.js';
import { GLOB_ASTRO } from '../globs.js';

export async function astro(options: OptionsOverrides & OptionsFiles & OptionsStylistic = {}): Promise<TypedFlatConfigItem[]> {
	const { files = [GLOB_ASTRO], overrides = {}, stylistic = true } = options;

	const [
		pluginAstro,
		parserAstro,
		parserTs,
	] = await Promise.all([
		interopDefault(import('eslint-plugin-astro')),
		interopDefault(import('astro-eslint-parser')),
		interopDefault(import('@typescript-eslint/parser')),
	] as const);

	return [
		{
			name: 'petal/astro/setup',
			plugins: {
				astro: pluginAstro,
			},
		},
		{
			files,
			languageOptions: {
				parser: parserAstro,
				parserOptions: {
					extraFileExtensions: ['.astro'],
					parser: parserTs as any,
				},
			},
			name: 'petal/astro/rules',
			processor: pluginAstro.processors['.astro'],
			rules: {
				'astro/no-set-html-directive': 'off',
				'astro/semi': 'off',

				...stylistic
					? {
							'style/indent': 'off',
							'style/jsx-closing-tag-location': 'off',
							'style/jsx-indent': 'off',
							'style/jsx-one-expression-per-line': 'off',
							'style/no-multiple-empty-lines': 'off',
						}
					: {},

				...overrides,
			},
		},
	];
}
