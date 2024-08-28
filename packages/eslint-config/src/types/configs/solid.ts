import type { OptionsAccessibility } from './accessibility';
import type { OptionsFiles } from './files';
import type { OptionsOverrides } from './overrides';
import type { OptionsHasTypeScript, OptionsTypeScriptWithTypes } from './typescript';

export type OptionsSolid = OptionsHasTypeScript & OptionsOverrides & OptionsFiles & OptionsTypeScriptWithTypes & OptionsAccessibility;
