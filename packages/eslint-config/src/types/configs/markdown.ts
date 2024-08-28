import type { OptionsComponentExts } from './components';
import type { OptionsFiles } from './files';
import type { OptionsOverrides } from './overrides';

export type OptionsMarkdown = OptionsFiles & OptionsComponentExts & OptionsOverrides;
