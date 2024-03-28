import type { OptionsOverrides, StylisticConfig, TypedFlatConfigItem } from '../types.js';
import { pluginPetal } from '../plugins.js';
import { interopDefault } from '../utils.js';

export const StylisticConfigDefaults: StylisticConfig = {
	indent: 'tab',
	jsx: true,
	quotes: 'single',
	semi: true,
};

export async function stylistic(options: StylisticConfig & OptionsOverrides = {}): Promise<TypedFlatConfigItem[]> {
	const { indent, jsx, overrides = {}, quotes, semi } = { ...StylisticConfigDefaults, ...options };

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

				'petal/top-level-function': 'error',
				'style/implicit-arrow-linebreak': 'off',

				...overrides,
			},
		},
	];
}
