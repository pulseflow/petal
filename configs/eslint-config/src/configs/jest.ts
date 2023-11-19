import globals from 'globals';
import type {
	ConfigItem,
	OptionsIsInEditor,
	OptionsOverrides,
} from '../types.js';
import { pluginJest, pluginNoOnlyTests } from '../plugins.js';
import { GLOB_TESTS } from '../globs.js';

export function jest(options: OptionsIsInEditor & OptionsOverrides = {}): ConfigItem[] {
	const { isInEditor = false, overrides = {} } = options;

	return [
		{
			name: 'petal:jest:startup',
			plugins: {
				jest: {
					...pluginJest,
					rules: {
						...pluginJest.rules,
						...pluginNoOnlyTests.rules,
					},
				},
			},
			settings: {
				jest: {
					version: 29,
				},
			},
		},
		{
			files: GLOB_TESTS,
			name: 'petal:test:rules',
			languageOptions: {
				globals: {
					...globals.jest,
					...globals.node,
				},
				parserOptions: {
					ecmaVersion: 2022,
					sourceType: 'module',
				},
			},
			rules: {
				'node/prefer-global/process': 'off',
				'test/no-only-tests': isInEditor ? 'off' : 'error',

				...overrides,
			},
		},
	];
}
