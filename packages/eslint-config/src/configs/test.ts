import type {
	OptionsFiles,
	OptionsOverrides,
	TypedFlatConfigItem,
} from '../types';
import { GLOB_TESTS } from '../globs';
import { interopDefault } from '../utils';

export async function test(options: OptionsOverrides & OptionsFiles = {}): Promise<TypedFlatConfigItem[]> {
	const { files = GLOB_TESTS, overrides = {} } = options;

	const pluginTest = await interopDefault(import('eslint-plugin-vitest'));
	const pluginPetal = await interopDefault(import('eslint-plugin-petal'));

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

				...overrides,
			},
		},
	];
}
