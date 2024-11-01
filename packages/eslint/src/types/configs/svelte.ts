import type { OptionsFiles } from './files';
import type { OptionsOverrides } from './overrides';
import type { OptionsStylistic } from './stylistic';
import type { OptionsHasTypeScript } from './typescript';

export type OptionsSvelte = OptionsHasTypeScript & OptionsOverrides & OptionsStylistic & OptionsFiles;
