import type { OptionsFiles } from './files';
import type { OptionsOverrides } from './overrides';
import type { OptionsStylistic } from './stylistic';

export type OptionsJsonc = OptionsOverrides & OptionsStylistic & OptionsFiles;
export type OptionsToml = OptionsOverrides & OptionsStylistic & OptionsFiles;
export type OptionsYaml = OptionsOverrides & OptionsStylistic & OptionsFiles;
