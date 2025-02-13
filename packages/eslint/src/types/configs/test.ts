import type { OptionsIsInEditor } from './editor';
import type { OptionsFiles } from './files';
import type { OptionsOverrides } from './overrides';

export interface OptionsTest extends OptionsOverrides, OptionsFiles, OptionsIsInEditor {
	/**
	 * Enable test type checking support.
	 *
	 * @default false
	 */
	typecheck?: boolean;
};
