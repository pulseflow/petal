import type { OptionsIsInEditor } from './editor';
import type { OptionsOverrides } from './overrides';
import type { OptionsStylistic } from './stylistic';

export type OptionsJavaScript = OptionsOverrides & OptionsIsInEditor;
export type OptionsJSDoc = OptionsOverrides & OptionsStylistic;
