import type { ReadonlyMap } from './ReadonlyMap';

export type ReadonlyMapKey<Type> = Type extends ReadonlyMap<infer Part> ? keyof Part : Type extends Record<infer Part, unknown> ? Part : never;
