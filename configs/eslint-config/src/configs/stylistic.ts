import type { OptionsOverrides, StylisticConfig, TypedFlatConfigItem } from '../types.js';
import { pluginPetal } from '../plugins.js';
import { interopDefault } from '../utils.js';

export const StylisticConfigDefaults: StylisticConfig = {
	indent: 'tab',
	jsx: true,
	quotes: 'single',
	semi: true,
};

export interface StylisticOptions extends StylisticConfig, OptionsOverrides {
	opinionated?: boolean;
}

export async function stylistic(options: StylisticOptions = {}): Promise<TypedFlatConfigItem[]> {
	const { indent, jsx, opinionated = true, overrides = {}, quotes, semi } = { ...StylisticConfigDefaults, ...options };

	const pluginStylistic = await interopDefault(import('@stylistic/eslint-plugin'));

	const config = pluginStylistic.configs.customize({ flat: true, indent, jsx, pluginName: 'style', quotes, semi });

	return [
		{
			name: 'petal/stylistic/rules',
			plugins: {
				petal: pluginPetal,
				style: pluginStylistic,
			},
			rules: {
				...config.rules,

				'petal/consistent-list-newline': 'error',

				...(opinionated
					? {
							'curly': ['error', 'multi-or-nest', 'consistent'],
							'petal/if-newline': 'error',
							'petal/top-level-function': 'error',
						}
					: {
							curly: 'error',
						}
				),

				...overrides,
			},
		},
	];
}
