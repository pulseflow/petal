/**
 * If `A` is `never`, `null`, or `undefined`, returns `B`. Otherwise, as long
 * as `A` is assignable to `B`, returns `A`. Otherwise, returns `never`.
 */
export type Or<A, B> = ([A & {}] extends [never] ? B : A) extends infer V extends B ? V : never;
