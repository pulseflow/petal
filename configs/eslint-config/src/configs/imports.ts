import type { ConfigItem, OptionsStylistic } from '../types.js';
import { pluginPetal, pluginImport } from '../plugins.js';

export const imports = (options: OptionsStylistic = {}): ConfigItem[] => {
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
};
