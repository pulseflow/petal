import type {
	OptionsFiles,
	OptionsIsInEditor,
	OptionsOverrides,
	TypedFlatConfigItem,
} from '../types';
import { GLOB_TESTS } from '../globs';
import { interopDefault } from '../utils';

let _pluginTest: any;

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

	_pluginTest = _pluginTest || {
		...pluginVitest,
		rules: {
			...pluginVitest.rules,
			...pluginNoOnlyTests.rules,
		},
	};

	return [
		{
			name: 'petal/test/setup',
			plugins: {
				test: _pluginTest,
			},
		},
		{
			files,
			name: 'petal/test/rules',
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
