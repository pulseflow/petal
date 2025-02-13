import type { Brand, NEVER } from './brand.ts';

/**
 * Creates a new branded type by intersecting the given type `V` with the
 * {@linkcode Brand} interface. This can be used to create nominal types in
 * TypeScript and prevent type collisions.
 *
 * This is an "overloaded" type that can be used in two ways:
 *   - If only two type arguments are provided, the first type `V` is branded
 *     with the second type `T` (e.g. `V & Brand<T>`).
 *   - If three type arguments are provided, the first type `V` is **unioned**
 *     with type `T`, which is branded with the third type `B`. This is useful
 *     for creating things like a string literal union with a brand type. It is
 *     equivalent to `V | Branded<T, B>`.
 *
 * @template V The type to brand with the given type `T`.
 * @template T The type to brand the given type `V` with.
 * @template [B=NEVER] The type that becomes the brand's value. Defaults to the
 * special `NEVER` type, which is a unique symbol that can be used to create a
 * simulated partial application of type parameters.
 * @category Utility Types
 */
export type Branded<V, T, B = NEVER> = [B] extends [NEVER] ? V & Brand<T>
	: V | Branded<T, B>;
