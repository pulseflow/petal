import type { Primitive } from './Primitive';

export type Builtin = Primitive | ((...args: []) => unknown) | Date | Error | RegExp;
