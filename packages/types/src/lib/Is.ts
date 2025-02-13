import type { Or } from './Or.ts';

/**
 * Casts a type `T` to a type `U`, but only if `T` is assignable to `U`. If
 * `Extract<T, U>` results in `never`, then the type `U` is returned as is.
 *
 * @template T The type to cast to the type `U`.
 * @template [U=unknown] The type to cast the type `T` to.
 * @category Utility Types
 */
export type Is<T, U = unknown> = Or<Extract<T, U>, U>;
