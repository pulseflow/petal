import type { UnionToIntersection } from './UnionToIntersection.ts';

export type LastOf<Type> = UnionToIntersection<Type extends any ? () => Type : never> extends () => infer Rest ? Rest : never;
