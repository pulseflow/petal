import type { OptionsOverrides } from './overrides';

export interface OptionsStylistic {
	/**
	 * The stylistic config if enabled.
	 *
	 * @default preset defaults for stylistic
	 */
	stylistic?: boolean | StylisticConfig;
}

export type StylisticConfig = Pick<
	import('@stylistic/eslint-plugin').StylisticCustomizeOptions,
	'indent' | 'quotes' | 'jsx' | 'semi'
> & OptionsOverrides;

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
