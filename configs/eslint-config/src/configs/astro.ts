import globals from 'globals';
import type {
	FlatConfigItem,
	OptionsFiles,
	OptionsHasTypeScript,
	OptionsOverrides,
} from '../types.js';
import { interopDefault } from '../utils.js';
import { GLOB_ASTRO } from '../globs.js';

export async function astro(options: OptionsHasTypeScript & OptionsOverrides & OptionsFiles = {}): Promise<FlatConfigItem[]> {
	const { files = [GLOB_ASTRO], overrides = {}, typescript = true } = options;

	const [
		pluginAstro,
		pluginA11y,
		parserAstro,
	] = await Promise.all([
		interopDefault(import('eslint-plugin-astro')),
		// @ts-expect-error missing types
		interopDefault(import('eslint-plugin-jsx-a11y')),
		interopDefault(import('astro-eslint-parser')),
	] as const);

	return [
		{
			name: 'petal:astro:setup',
			plugins: {
				'astro': pluginAstro,
				'jsx-a11y': pluginA11y,
			},
		},
		{
			files,
			languageOptions: {
				globals: {
					...globals.browser,
					...globals.es2020,
					'astro/astro': true,
				},
				parser: parserAstro,
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
					extraFileExtensions: ['.astro'],
					parser: typescript
						? await interopDefault(import('@typescript-eslint/parser')) as any
						: null,
					sourceType: 'module',
				},
			},
			name: 'petal:astro:rules',
			processor: pluginAstro.processors['.astro'],
			rules: {
				...(pluginAstro.configs.recommended.rules as any),

				'import/default': 'off',
				'import/order': ['error', {
					alphabetize: {
						caseInsensitive: true,
						order: 'asc',
					},
					warnOnUnassignedImports: true,
				}],
				'node/prefer-global/process': 'off',
				'style/implicit-arrow-linebreak': 'off',
				'style/indent': 'off',
				'style/jsx-closing-bracket-location': 'off',
				'style/jsx-indent': 'off',
				'style/jsx-one-expression-per-line': 'off',
				'style/jsx-tag-spacing': 'off',

				...overrides,
			},
		},
	];
}
