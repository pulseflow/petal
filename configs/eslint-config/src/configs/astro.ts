import type {
	FlatConfigItem,
	OptionsHasTypeScript,
	OptionsOverrides,
} from '../types.js';
import { interopDefault } from '../utils.js';
import { GLOB_ASTRO } from '../globs.js';

export async function astro(options: OptionsHasTypeScript & OptionsOverrides = {}): Promise<FlatConfigItem[]> {
	const { overrides = {} } = options;

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
				astro: pluginAstro as any,
				a11y: pluginA11y,
			},
		},
		{
			files: [GLOB_ASTRO],
			languageOptions: {
				parser: parserAstro,
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
					sourceType: 'module',
					parser: options.typescript
						? await interopDefault(import('@typescript-eslint/parser')) as any
						: null,
					extraFileExtensions: ['.astro'],
				},
			},
			name: 'petal:astro:rules',
			processor: pluginAstro.processors['.astro'],
			rules: {
				...(pluginAstro.configs.recommended.rules as any),

				...overrides,
			},
		},
	];
}
