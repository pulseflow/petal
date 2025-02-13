/**
 * Returns a union of the keys of an object `T` whose values are functions.
 * This is useful for extracting the keys of a class's methods.
 * @template T The object type to extract keys from.
 * @category Utility Types
 */
export type FunctionKeys<T> = {
	[K in keyof T]: T[K] extends (...args: any) => any ? K : never;
}[keyof T];
