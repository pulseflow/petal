/**
 * Represents the mildest form of a branded generic string type. This type is
 * used to create string literal unions that accept any string input, but will
 * preserve the literal string union members for autocomplete purposes.
 *
 * For example, using `strings | "foo" | "bar"` for an argument type will allow
 * any string to be passed, but will still suggest `"foo"` or `"bar"` as valid
 * suggestions in an editor that supports TypeScript's language server.
 *
 * > **Note**: the lowercase name was chosen for this type to intentionally
 * > convey that it is capable of being assigned any `string` value. It also
 * > helps distinguish this type from the built-in `string` type, while still
 * > being visually similar.
 *
 * @category Utility Types
 */
export type strings = string & {};

/**
 * Represents the mildest form of a branded generic number type. This type is
 * used to create number literal unions that accept any number input, but will
 * preserve the literal number union members for autocomplete purposes.
 *
 * Similiar to {@linkcode strings}, this type is useful for creating number
 * literal unions that accept any number, but will still suggest the literal
 * number union members for autocomplete purposes.
 *
 * > **Note**: the lowercase name was chosen for this type to intentionally
 * > convey that it is capable of being assigned any `number` value. It also
 * > helps distinguish this type from the built-in `number` type, while still
 * > being visually similar.
 *
 * @category Utility Types
 */
export type numbers = number & {};

/**
 * Represents the mildest form of a branded generic symbol type. This type is
 * used to create symbol literal unions that accept any symbol input, but will
 * preserve the literal symbol union members for autocomplete purposes.
 *
 * Similiar to {@linkcode strings} and {@linkcode numbers}, this type is useful
 * for creating symbol literal unions that accept any symbol, but will still
 * suggest the literal symbol union members for autocomplete purposes.
 *
 * > **Note**: the lowercase name was chosen for this type to intentionally
 * > convey that it is capable of being assigned any `symbol` value. It also
 * > helps distinguish this type from the built-in `symbol` type, while still
 * > being visually similar.
 *
 * @category Utility Types
 */
// We cannot just intersect `symbol` with `{}`, as this will widen the type to
// `symbol`. Instead, we need to create a new type that is a subtype of symbol,
// with a property that is never used.
export type symbols = symbol & {}; // export type symbols = symbol & { [BRAND]?: never };

/**
 * Union of {@linkcode strings}, {@linkcode numbers}, and {@linkcode symbols},
 * this type can be used as an "anchor" type in a literal union of properties.
 * This will ensure your literal union is not widened to a `string`, `number`,
 * or `symbol` type, but will still accept any of these types as valid inputs.
 *
 * @category Utility Types
 */
export type PropertyKeys = strings | numbers | symbols;

export type { PropertyKeys as properties };
