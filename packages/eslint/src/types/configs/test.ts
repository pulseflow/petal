import type { OptionsFiles } from './files';
import type { OptionsOverrides } from './overrides';

export interface OptionsTest extends OptionsOverrides, OptionsFiles {
	/**
	 * Enable test type checking support.
	 *
	 * @default false
	 */
	typecheck?: boolean;
};
