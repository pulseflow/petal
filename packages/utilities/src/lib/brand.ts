/* eslint-disable ts/no-redeclare -- intentionally redeclare symbol types */

/**
 * Represents a unique symbol that is used to create branded and flavored types
 * in TypeScript. This symbol is used to create nominal types and prevent type
 * collisions in the type system.
 * @see https://michalzalecki.com/nominal-typing-in-typescript/
 * @see {@linkcode Brand} for more information on branded types.
 * @see {@linkcode Branded} for a helper type that creates branded types.
 * @see {@linkcode Flavor} for more information on flavored types.
 * @see {@linkcode Flavored} for a helper type that creates flavored types.
 * @category Utility Types
 */
export const BRAND: unique symbol = Symbol('BRAND');

/**
 * Represents a unique symbol that is used to create branded and flavored types
 * in TypeScript. This symbol is used to create nominal types and prevent type
 * collisions in the type system.
 * @see https://michalzalecki.com/nominal-typing-in-typescript/
 * @see {@linkcode Brand} for more information on branded types.
 * @see {@linkcode Branded} for a helper type that creates branded types.
 * @see {@linkcode Flavor} for more information on flavored types.
 * @see {@linkcode Flavored} for a helper type that creates flavored types.
 * @category Utility Types
 */
export type BRAND = typeof BRAND;

/**
 * Represents a unique symbol that can be used to create a simulated partial
 * application of type parameters. This is useful for creating branded types
 * with a default value for a type parameter.
 * @category Utility Types
 */
export const NEVER: unique symbol = Symbol('NEVER');

/**
 * Represents a unique symbol that can be used to create a simulated partial
 * application of type parameters. This is useful for creating branded types
 * with a default value for a type parameter.
 * @category Utility Types
 */
export type NEVER = typeof NEVER;

/**
 * Represents a unique brand for a type, which can be used to create nominal
 * types in TypeScript and prevent type collisions. For a less-strict version
 * of this type, see the {@linkcode Flavor} interface.
 *
 * To create a branded type, you can either use the {@linkcode Branded} helper
 * type, or manually extend/intersect another type with this interface. The
 * {@linkcode A} type parameter is the type that becomes the brand's value, and
 * it defaults to `never`.
 */
export interface Brand<B = never> {
	readonly [BRAND]: B;
}
