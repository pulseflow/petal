import type { FlatConfigItem, StylisticConfig } from '../types.js';
import { pluginPetal } from '../plugins.js';
import { interopDefault } from '../utils.js';

export async function stylistic(options: StylisticConfig = {}): Promise<FlatConfigItem[]> {
	const { indent = 'tab', jsx = true, quotes = 'single', semi = true } = options;

	const pluginStylistic = await interopDefault(import('@stylistic/eslint-plugin'));

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

				'curly': ['error', 'multi-or-nest', 'consistent'],
				'petal/consistent-list-newline': 'error',
				'petal/if-newline': 'error',
				'petal/indent-binary-ops': ['error', { indent }],

				'petal/top-level-function': 'error',
			},
		},
	];
}
