import type { Swap } from '@flowr/types';

export const swap = <Object, Key extends keyof Object, Value>(obj: Object, key: Key, value: Value): Swap<Object, Key, Value> => ({ ...obj, [key]: value });
