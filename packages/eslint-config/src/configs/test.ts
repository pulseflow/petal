import { GLOB_TESTS } from '../globs';
import { interopDefault } from '../utils';
import type { OptionsTest, TypedFlatConfigItem } from '../types';

export async function test(options: OptionsTest = {}): Promise<TypedFlatConfigItem[]> {
	const { files = GLOB_TESTS, overrides = {} } = options;

	const [pluginTest, pluginPetal] = await Promise.all([
		interopDefault(import('@vitest/eslint-plugin')),
		interopDefault(import('eslint-plugin-petal')),
	] as const);

	return [
		{
			name: 'petal/test/setup',
			plugins: {
				petal: pluginPetal,
				test: pluginTest,
			},
		},
		{
			files,
			name: 'petal/test/rules',
			rules: {
				'node/prefer-global/process': 'off',

				'petal/no-only-tests': 'error',

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
