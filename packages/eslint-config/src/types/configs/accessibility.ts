export interface OptionsAccessibility {
	/**
	 * Enable accessibility rules.
	 *
	 * Requires installing:
	 * - `eslint-plugin-jsx-a11y` on JSX
	 * - `eslint-plugin-vuejs-accessibility` on Vue
	 *
	 * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y
	 * @see https://github.com/vue-a11y/eslint-plugin-vuejs-accessibility
	 * @default false
	 */
	accessibility?: boolean;
}
