import type { OptionsOverrides } from './overrides';

export interface OptionsRegExp extends OptionsOverrides {
	/**
	 * Override RegExp rule levels
	 *
	 * @default 'error'
	 */
	level?: 'error' | 'warn';
}
