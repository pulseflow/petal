import globals from 'globals';
import type {
	FlatConfigItem,
	OptionsFiles,
	OptionsIsInEditor,
	OptionsOverrides,
} from '../types.js';
import { GLOB_TESTS } from '../globs.js';
import { interopDefault } from '../utils.js';

export async function jest(options: OptionsIsInEditor & OptionsOverrides & OptionsFiles = {}): Promise<FlatConfigItem[]> {
	const { files = GLOB_TESTS, isInEditor = false, overrides = {} } = options;

	const [
		pluginJest,
		pluginNoOnlyTests,
	] = await Promise.all([
		// @ts-expect-error missing types
		interopDefault(import('eslint-plugin-jest')),
		// @ts-expect-error missing types
		interopDefault(import('eslint-plugin-no-only-tests')),
	] as const);

	return [
		{
			name: 'petal:jest:setup',
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
			files,
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
			name: 'petal:test:rules',
			rules: {
				'node/prefer-global/process': 'off',
				'test/no-only-tests': isInEditor ? 'off' : 'error',

				...overrides,
			},
		},
	];
}
