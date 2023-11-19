import type {
	ConfigItem,
	OptionsHasTypeScript,
	OptionsOverrides,
} from '../types.js';
import {
	parserAstro,
	parserTs,
	pluginA11y,
	pluginAstro,
} from '../plugins.js';
import { GLOB_ASTRO } from '../globs.js';

export function astro(options: OptionsHasTypeScript & OptionsOverrides = {}): ConfigItem[] {
	const { overrides = {} } = options;

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
					parser: options.typescript ? (parserTs as any) : null,
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
