import type { TypedFlatConfigItem } from '../index';

export interface OptionsAccessibility<T = DefaultAccessibility> {
	/**
	 * Enable accessibility rules.
	 *
	 * Requires installing:
	 * - `eslint-plugin-jsx-a11y` for JSX
	 * - `eslint-plugin-vuejs-accessibility` for Vue
	 *
	 * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y
	 * @see https://github.com/vue-a11y/eslint-plugin-vuejs-accessibility
	 * @default false
	 */
	accessibility?: boolean | T;
}

export interface DefaultAccessibility {
	/**
	 * Override accessibility rules.
	 *
	 * Requires installing:
	 * - `eslint-plugin-jsx-a11y` for JSX
	 * - `eslint-plugin-vuejs-accessibility` for Vue
	 *
	 * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y
	 * @see https://github.com/vue-a11y/eslint-plugin-vuejs-accessibility
	 * @default {}
	 */
	overrideA11y: TypedFlatConfigItem['rules'];
}
