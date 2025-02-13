import type { OptionsTest, TypedFlatConfigItem } from '../types/index.ts';
import { GLOB_TESTS } from '../globs.ts';
import { interopDefault } from '../utils.ts';

export async function test(options: OptionsTest = {}): Promise<TypedFlatConfigItem[]> {
	const { files = GLOB_TESTS, overrides = {}, typecheck = false } = options;

	const [pluginTest, pluginPetal] = await Promise.all([
		interopDefault(import('@vitest/eslint-plugin')),
		interopDefault(import('eslint-plugin-petal')),
	] as const);

	return [
		{
			languageOptions: {
				globals: {
					...pluginTest.environments.env.globals,
				},
			},
			name: 'petal/test/setup',
			plugins: {
				petal: pluginPetal,
				test: pluginTest,
			},
			settings: {
				vitest: {
					typecheck,
				},
			},
		},
		{
			files,
			name: 'petal/test/rules',
			rules: {
				'node/prefer-global/buffer': 'off',
				'node/prefer-global/process': 'off',

				'petal/no-only-tests': options.isInEditor ?? false ? 'warn' : 'error',

				'test/consistent-test-it': ['error', { fn: 'it', withinDescribe: 'it' }],
				'test/no-identical-title': 'error',
				'test/no-import-node-test': 'error',
				'test/prefer-hooks-in-order': 'error',
				'test/prefer-lowercase-title': 'error',

				'ts/explicit-function-return-type': 'off',

				...overrides,
			},
		},
	];
}
