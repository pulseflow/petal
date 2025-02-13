import type { NEVER } from './brand.ts';
import type { Flavor } from './flavor.ts';

/**
 * Creates a new flavored type by intersecting the given type `V` with the
 * {@linkcode Flavor} interface. This can be used to create nominal types in
 * TypeScript and prevent type collisions.
 *
 * This is an "overloaded" type that can be used in two ways:
 *   - If only two type arguments are provided, the first type `V` is flavored
 *     with the second type `T` (e.g. `V & Flavor<T>`).
 *   - If three type arguments are provided, the first type `V` is **unioned**
 *     with type `T`, which is flavored with the third type `F`. This is useful
 *     for creating things like a string literal union with a flavor type. It
 *     is equivalent to `V | Flavored<T, F>`.
 *
 * @template V The type to flavor with the given type `T`.
 * @template T The type to flavor the given type `V` with.
 * @template [F=NEVER] The type that becomes the flavor's value. Defaults to
 * the special `NEVER` type, which is a unique symbol that can be used to
 * create a simulated partial application of type parameters.
 * @category Utility Types
 */
export type Flavored<V, T, F = NEVER> = [F] extends [NEVER] ? V & Flavor<T>
	: V | Flavored<T, F>;
