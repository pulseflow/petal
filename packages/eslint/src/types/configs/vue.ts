import type { OptionsAccessibility } from './accessibility';
import type { OptionsFiles } from './files';
import type { OptionsOverrides } from './overrides';
import type { OptionsStylistic } from './stylistic';
import type { OptionsHasTypeScript } from './typescript';

export interface OptionsVue extends OptionsOverrides, OptionsAccessibility, OptionsHasTypeScript, OptionsStylistic, OptionsFiles {
	/**
	 * Create virtual files for Vue SFC blocks to enable linting.
	 *
	 * Requires installing:
	 * `eslint-processor-vue-blocks`
	 *
	 * @see [`eslint-processor-vue-blocks` github](https://github.com/antfu/eslint-processor-vue-blocks)
	 * @default true
	 */
	sfcBlocks?: boolean | import('eslint-processor-vue-blocks').Options;

	/**
	 * Vue version. Apply different rules set from `eslint-plugin-vue`
	 *
	 * @see https://eslint.vuejs.org/rules/
	 * @default 3
	 */
	vueVersion?: 2 | 3;
}
