import type { StylisticConfig, StylisticOptions, TypedFlatConfigItem } from '../types/index.ts';
import { interopDefault } from '../utils.ts';

export const StylisticConfigDefaults: StylisticConfig = {
	indent: 'tab',
	jsx: true,
	quotes: 'single',
	semi: true,
};

export async function stylistic(options: StylisticOptions = {}): Promise<TypedFlatConfigItem[]> {
	const { indent, jsx, opinionated = true, overrides = {}, quotes, semi } = { ...StylisticConfigDefaults, ...options };

	const [pluginStylistic, pluginPetal] = await Promise.all([
		interopDefault(import('@stylistic/eslint-plugin')),
		interopDefault(import('eslint-plugin-petal')),
	] as const);

	const config = pluginStylistic.configs.customize({ indent, jsx, pluginName: 'style', quotes, semi });

	return [
		{
			name: 'petal/stylistic/rules',
			plugins: {
				petal: pluginPetal,
				style: pluginStylistic,
			},
			rules: {
				...config.rules,

				'petal/consistent-chaining': 'error',
				'petal/consistent-list-newline': 'error',

				...opinionated
					? {
							'curly': ['error', 'multi', 'consistent'],
							'petal/if-newline': 'error',
							'petal/top-level-function': 'error',
						}
					: {
							curly: 'error',
						},

				...overrides,
			},
		},
	];
}
