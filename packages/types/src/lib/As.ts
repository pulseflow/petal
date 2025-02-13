/**
 * Casts a type `T` to a type `U`, but only if `T` is assignable to `U`. If
 * `T` is not assignable to `U`, and if `T & U` results in `never`, then the
 * type `U` is intersected with the type `Omit<T, keyof U>`. This allows for
 * partial type casting, where the two types are merged but defer to `U` where
 * possible. If `T` is not assignable to `U`, and if `T & U` does not result in
 * `never`, then the last resort is to return the intersection of `T` and `U`.
 *
 * @template T The type to cast to the type `U`.
 * @template U The type to cast the type `T` to.
 */
export type As<T, U = unknown> = T extends U ? U extends T ? U : T
	: [T & U] extends [never] ? U & Omit<T, keyof U>
			: T & U;
