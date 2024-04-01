import type { OptionsStylistic, TypedFlatConfigItem } from '../types.js';
import { pluginImport, pluginPetal } from '../plugins.js';
import { GLOB_SRC_EXT } from '../globs.js';

export async function imports(options: OptionsStylistic = {}): Promise<TypedFlatConfigItem[]> {
	const { stylistic = true } = options;

	return [
		{
			name: 'petal:imports',
			plugins: {
				import: pluginImport,
				petal: pluginPetal,
			},
			rules: {
				'import/first': 'error',
				'import/no-duplicates': 'error',

				'import/no-mutable-exports': 'error',
				'import/no-named-default': 'error',
				'import/no-self-import': 'error',
				'import/no-webpack-loader-syntax': 'error',
				'import/order': 'error',
				'petal/import-dedupe': 'error',
				'petal/no-import-dist': 'error',
				'petal/no-import-node-modules-by-path': 'error',

				...(stylistic
					? {
							'import/newline-after-import': [
								'error',
								{ count: 1 },
							],
						}
					: {}),
			},
		},
		{
			files: ['**/bin/**/*', `**/bin.${GLOB_SRC_EXT}`],
			name: 'petal:disables:imports-bin',
			rules: {
				'petal/no-import-dist': 'off',
				'petal/no-import-node-modules-by-path': 'off',
			},
		},
	];
}
