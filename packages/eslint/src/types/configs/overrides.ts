import type { TypedFlatConfigItem } from '../index';

export interface OptionsOverrides {
	/**
	 * Overrides for this Ruleset.
	 *
	 * @default {} the default ruleset, with the overrides being applied last
	 */
	overrides?: TypedFlatConfigItem['rules'];
}
