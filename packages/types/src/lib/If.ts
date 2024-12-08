/**
 * A type utility that allows branching of types depending on the `Value` parameter.
 * @example
 * ```typescript
 * declare function get<const GetValues extends boolean = false>(
 * 	getValues?: GetValues
 * ): If<GetValues, string, string[]>;
 *
 * const a = get(true);
 * //    ^? string
 *
 * const b = get(false);
 * //    ^? string[]
 *
 * declare const someBoolean: boolean;
 * const c = get(someBoolean);
 * //    ^? string | string[]
 * ```
 */
export type If<Value extends boolean, TrueResult, FalseResult> = Value extends true
	? TrueResult
	: Value extends false
		? FalseResult
		: TrueResult | FalseResult;
