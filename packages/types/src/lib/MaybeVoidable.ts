import type { VoidableArgument } from './VoidableArgument.ts';

/**
 * Used to determine the return type of a decorator function. If the argument
 * {@linkcode V} is `true`, then this resolves to `void | T`. If the argument
 * `V` is `false`, it resolves to just `T`. If `V` is `void`, it resolves to
 * just `void`.
 *
 * @template T The type of the return value.
 * @template {VoidableArgument} V Whether the return type should include `void`.
 * @category Utility Types
 */
export type MaybeVoidable<T, V extends VoidableArgument = true> =
	| ([V] extends [true] | [void] ? void : never)
	| ([V] extends [void] ? never : T);
