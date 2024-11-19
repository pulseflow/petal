import type { OptionsAccessibility } from './accessibility';
import type { OptionsFiles } from './files';
import type { OptionsOverrides } from './overrides';
import type { OptionsTypeScriptParserOptions, OptionsTypeScriptWithTypes } from './typescript';

export type OptionsReact = OptionsTypeScriptWithTypes & OptionsTypeScriptParserOptions & OptionsOverrides & OptionsFiles & OptionsAccessibility;
