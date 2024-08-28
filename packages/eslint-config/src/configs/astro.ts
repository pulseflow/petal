import type { OptionsAstro, TypedFlatConfigItem } from '../types';
import { ensurePackages, interopDefault } from '../utils';
import { GLOB_ASTRO } from '../globs';

export async function astro(options: OptionsAstro = {}): Promise<TypedFlatConfigItem[]> {
	const { accessibility = false, files = [GLOB_ASTRO], overrides = {}, stylistic = true } = options;

	await ensurePackages(['eslint-plugin-astro']);

	if (accessibility)
		await ensurePackages(['eslint-plugin-jsx-a11y']);

	const [pluginAstro, parserAstro, parserTs] = await Promise.all([
		interopDefault(import('eslint-plugin-astro')),
		interopDefault(import('astro-eslint-parser')),
		interopDefault(import('@typescript-eslint/parser')),
	] as const);

	return [
		{
			name: 'petal/astro/setup',
			plugins: {
				astro: pluginAstro,

				...accessibility ? { 'jsx-a11y': await interopDefault(import('eslint-plugin-jsx-a11y')) } : {},
			},
		},
		{
			files,
			languageOptions: {
				ecmaVersion: 'latest',
				globals: pluginAstro.environments.astro.globals,
				parser: parserAstro,
				parserOptions: {
					extraFileExtensions: ['.astro'],
					parser: parserTs,
				},
				sourceType: 'module',
			},
			name: 'petal/astro/rules',
			processor: pluginAstro.processors['client-side-ts'],
			rules: {
				'astro/missing-client-only-directive-value': 'error',
				'astro/no-conflict-set-directives': 'error',
				'astro/no-deprecated-astro-canonicalurl': 'error',
				'astro/no-deprecated-astro-fetchcontent': 'error',
				'astro/no-deprecated-astro-resolve': 'error',
				'astro/no-deprecated-getentrybyslug': 'error',
				'astro/no-set-html-directive': 'error',
				'astro/no-unused-css-selector': 'error',
				'astro/no-unused-define-vars-in-style': 'error',
				'astro/semi': 'off',
				'astro/valid-compile': 'error',

				...stylistic
					? {
							'style/indent': 'off',
							'style/jsx-closing-tag-location': 'off',
							'style/jsx-one-expression-per-line': 'off',
							'style/no-multiple-empty-lines': 'off',
						}
					: {},

				...accessibility ? pluginAstro.configs['flat/jsx-a11y-recommended'][0].rules : {},

				...overrides,
			},
		},
	];
}
