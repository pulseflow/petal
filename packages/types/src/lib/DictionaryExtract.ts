import type { DictionaryPosition } from './DictionaryPosition';

export type DictionaryExtract<Type> = DictionaryPosition<Type> | Type;
