import type { ConfigItem, StylisticConfig } from '../types.js';
import { pluginPetal, pluginStylistic } from '../plugins.js';

export const stylistic = (options: StylisticConfig = {}): ConfigItem[] => {
	const { indent = 'tab', jsx = true, quotes = 'single', semi = true } = options;
	const config = pluginStylistic.configs.customize({ flat: true, indent, jsx, pluginName: 'style', quotes, semi });

	return [
		{
			name: 'petal:stylistic',
			plugins: {
				petal: pluginPetal,
				style: pluginStylistic,
			},
			rules: {
				...config.rules,

				'petal/consistent-list-newline': 'error',
				'petal/if-newline': 'error',
				'petal/indent-binary-ops': ['error', { indent }],
				'petal/top-level-function': 'error',

				curly: ['error', 'multi-or-nest', 'consistent'],
			},
		},
	];
};
