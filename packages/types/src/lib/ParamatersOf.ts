import type { ValueOf } from './ValueOf.ts';

export type ParametersOf<T, Fallback extends readonly unknown[] = never> =
	| [T] extends [never] ? Fallback : ParametersOfWorker<
		| T extends (...args: any) => any ? T
			: ValueOf<T> extends infer U
				? U extends (...args: any) => any ? U : never
				: Fallback,
		Fallback
	> extends infer A extends readonly unknown[] ? A
		: Fallback;

type ParametersOfWorker<T, Fallback extends readonly unknown[]> =
	| T extends (...args: infer A) => any ? Readonly<A> : Fallback;
