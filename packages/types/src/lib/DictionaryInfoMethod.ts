import type { Dictionary } from './Dictionary';

export interface DictionaryInfoMethod<Type> extends Dictionary<DictionaryInfoMethod<Type>> { (): Type };
