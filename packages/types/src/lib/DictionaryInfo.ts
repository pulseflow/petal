import type { Dictionary } from './Dictionary';

export interface DictionaryInfo<Type> extends Dictionary<DictionaryInfo<Type>> {}
