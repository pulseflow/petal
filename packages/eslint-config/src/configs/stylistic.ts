import { interopDefault } from '../utils';
import type { OptionsOverrides, StylisticConfig, TypedFlatConfigItem } from '../types';

export const StylisticConfigDefaults: StylisticConfig = {
	indent: 'tab',
	jsx: true,
	quotes: 'single',
	semi: true,
};

export interface StylisticOptions extends StylisticConfig, OptionsOverrides {
	/**
	 * Enable or disable more opinionated rules, including:
	 *
	 * - `'curly': ['error', 'multi', 'consistent']`
	 * - `'petal/if-newline': 'error'`
	 * - `'petal/top-level-function': 'error'`
	 *
	 * @default true
	 */
	opinionated?: boolean;
}

export async function stylistic(options: StylisticOptions = {}): Promise<TypedFlatConfigItem[]> {
	const { indent, jsx, opinionated = true, overrides = {}, quotes, semi } = { ...StylisticConfigDefaults, ...options };

	const [pluginStylistic, pluginPetal] = await Promise.all([
		interopDefault(import('@stylistic/eslint-plugin')),
		interopDefault(import('eslint-plugin-petal')),
	] as const);

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
