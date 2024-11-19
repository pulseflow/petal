import type { Dictionary } from './Dictionary';

export interface DictionaryPosition<Type> extends Dictionary<DictionaryPosition<Type> | Type> {}
