import type { OptionsIsInEditor } from './editor';
import type { OptionsOverrides } from './overrides';
import type { OptionsStylistic } from './stylistic';

export type OptionsJavascript = OptionsOverrides & OptionsIsInEditor;
export type OptionsJsdoc = OptionsStylistic;
