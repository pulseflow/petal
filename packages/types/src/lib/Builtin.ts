import type { Primitive } from './Primitive';

export type Builtin = Primitive | ((...args: any[]) => any) | Date | Error | RegExp;
