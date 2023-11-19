import type {
	ConfigItem,
	OptionsIsInEditor,
	OptionsOverrides,
} from '../types.js';
import { pluginNoOnlyTests, pluginVitest } from '../plugins.js';
import { GLOB_TESTS } from '../globs.js';

export function test(options: OptionsIsInEditor & OptionsOverrides = {}): ConfigItem[] {
	const { isInEditor = false, overrides = {} } = options;

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
			files: GLOB_TESTS,
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
