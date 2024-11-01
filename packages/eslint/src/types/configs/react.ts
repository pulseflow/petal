import type { OptionsAccessibility } from './accessibility';
import type { OptionsFiles } from './files';
import type { OptionsOverrides } from './overrides';
import type { OptionsTypeScriptWithTypes } from './typescript';

export type OptionsReact = OptionsTypeScriptWithTypes & OptionsOverrides & OptionsFiles & OptionsAccessibility;
