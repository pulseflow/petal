import type {
	OptionsFiles,
	OptionsIsInEditor,
	OptionsOverrides,
	TypedFlatConfigItem,
} from '../types.js';
import { GLOB_TESTS } from '../globs.js';
import { interopDefault } from '../utils.js';

export async function test(options: OptionsIsInEditor & OptionsOverrides & OptionsFiles = {}): Promise<TypedFlatConfigItem[]> {
	const { files = GLOB_TESTS, isInEditor = false, overrides = {} } = options;

	const [
		pluginVitest,
		pluginNoOnlyTests,
	] = await Promise.all([
		interopDefault(import('eslint-plugin-vitest')),
		// @ts-expect-error missing types
		interopDefault(import('eslint-plugin-no-only-tests')),
	] as const);

	return [
		{
			name: 'petal:test:setup',
			plugins: {
				test: {
					...pluginVitest,
					rules: {
						...pluginVitest.rules,
						...pluginNoOnlyTests.rules,
					},
				},
			},
		},
		{
			files,
			name: 'petal:test:rules',
			rules: {
				'node/prefer-global/process': 'off',

				'test/consistent-test-it': [
					'error',
					{ fn: 'it', withinDescribe: 'it' },
				],
				'test/no-identical-title': 'error',
				'test/no-only-tests': isInEditor ? 'off' : 'error',
				'test/prefer-hooks-in-order': 'error',
				'test/prefer-lowercase-title': 'error',

				...overrides,
			},
		},
	];
}
