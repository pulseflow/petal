import type { OptionsOverrides } from './overrides';

export interface OptionsUnoCSS extends OptionsOverrides {
	/**
	 * Enable attributify support.
	 *
	 * @see https://unocss.dev/integrations/eslint#rules
	 * @default true
	 */
	attributify?: boolean;

	/**
	 * Enable strict mode (throws errors about blocked classes)
	 *
	 * @see https://unocss.dev/integrations/eslint#unocss-blocklist
	 * @default false
	 */
	strict?: boolean;
}
