/* eslint-disable perfectionist/sort-objects -- rules need to be in this order */
import type { OptionsStylistic, TypedFlatConfigItem } from '../types';
import { GLOB_BIN, GLOB_BIN_SRC } from '../globs';
import { interopDefault } from '../utils';

export async function imports(options: OptionsStylistic = {}): Promise<TypedFlatConfigItem[]> {
	const { stylistic = true } = options;

	const [
		pluginImport,
		pluginPetal,
	] = await Promise.all([
		interopDefault(import('eslint-plugin-import-x')),
		interopDefault(import('eslint-plugin-petal')),
	] as const);

	return [
		{
			name: 'petal/imports/rules',
			plugins: {
				import: pluginImport,
				petal: pluginPetal,
			},
			rules: {
				'petal/import-dedupe': 'error',
				'petal/no-import-dist': 'error',
				'petal/no-import-node-modules-by-path': 'error',

				'import/first': 'error',
				'import/no-duplicates': 'error',
				'import/no-mutable-exports': 'error',
				'import/no-named-default': 'error',
				'import/no-self-import': 'error',
				'import/no-webpack-loader-syntax': 'error',
				'import/order': 'error',

				...stylistic
					? {
							'import/newline-after-import': ['error', { count: 1 }],
						}
					: {},
			},
		},
		{
			files: [GLOB_BIN, GLOB_BIN_SRC],
			name: 'petal/imports/disables/bin',
			rules: {
				'petal/no-import-dist': 'off',
				'petal/no-import-node-modules-by-path': 'off',
			},
		},
	];
}
