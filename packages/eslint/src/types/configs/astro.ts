import type { OptionsAccessibility } from './accessibility.ts';
import type { OptionsFiles } from './files';
import type { OptionsOverrides } from './overrides';
import type { OptionsStylistic } from './stylistic';

export type OptionsAstro = OptionsOverrides & OptionsFiles & OptionsStylistic & OptionsAccessibility;
