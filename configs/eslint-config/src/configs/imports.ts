import type { FlatConfigItem, OptionsStylistic } from '../types.js';
import { pluginImport, pluginPetal } from '../plugins.js';

export async function imports(options: OptionsStylistic = {}): Promise<FlatConfigItem[]> {
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
				'petal/no-import-node-modules-by-path': 'error',

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
