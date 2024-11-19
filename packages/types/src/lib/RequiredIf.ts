import type { If } from './If.ts';

/**
 * A type utility that allows branching of an union type on the `Value` parameter.
 * @example
 * ```typescript
 * declare function get<const Required extends boolean = false>(
 *   required?: Required
 * ): If<Required, string>;
 *
 * const a = get(true);
 * //    ^? string
 *
 * const b = get(false);
 * //    ^? string | null
 *
 * declare const someBoolean: boolean;
 * const c = get(someBoolean);
 * //    ^? string | null
 * ```
 */
export type RequiredIf<Value extends boolean, ValueType, FallbackType = null> = If<Value, ValueType, ValueType | FallbackType>;
