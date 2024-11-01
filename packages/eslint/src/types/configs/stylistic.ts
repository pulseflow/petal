import type { OptionsOverrides } from './overrides';

export interface OptionsStylistic {
	/**
	 * The stylistic config if enabled.
	 *
	 * @default preset defaults for stylistic
	 */
	stylistic?: boolean | StylisticConfig;
}

export interface StylisticConfig extends Pick<
	import('@stylistic/eslint-plugin').StylisticCustomizeOptions,
	'indent' | 'jsx' | 'semi'
>, OptionsOverrides {
	/**
	 * Quote style
	 * Similar to `singleQuote` option in Prettier
	 *
	 * @default 'single'
	 */
	quotes?: 'single' | 'double';
}

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
