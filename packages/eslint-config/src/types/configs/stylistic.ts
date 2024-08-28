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
	'indent' | 'quotes' | 'jsx' | 'semi'
>, OptionsOverrides { }
