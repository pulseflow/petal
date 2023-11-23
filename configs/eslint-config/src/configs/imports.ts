import type { FlatConfigItem, OptionsStylistic } from '../types.js';
import { pluginImport, pluginPetal } from '../plugins.js';

export async function imports(options: OptionsStylistic = {}): Promise<FlatConfigItem[]> {
	const { stylistic = true } = options;

	return [
		{
			name: 'petal:imports',
			plugins: {
				petal: pluginPetal,
				import: pluginImport,
			},
			rules: {
				'petal/import-dedupe': 'error',
				'petal/no-import-node-modules-by-path': 'error',

				'import/first': 'error',
				'import/no-duplicates': 'error',
				'import/no-mutable-exports': 'error',
				'import/no-named-default': 'error',
				'import/no-self-import': 'error',
				'import/no-webpack-loader-syntax': 'error',
				'import/order': 'error',

				...(stylistic
					? {
							'import/newline-after-import': [
								'error',
								{ considerComments: true, count: 1 },
							],
						}
					: {}),
			},
		},
	];
}
