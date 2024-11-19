import type { Rename } from '@flowr/types';
import { omit } from './omit';

export function rename<Object extends Record<string | number | symbol, unknown>, From extends keyof Object, To extends string>(obj: Object, from: From, to: To): Rename<Object, From, To> {
	return ({ ...omit(obj, from), [to]: obj[from] }) as Rename<Object, From, To>;
}
