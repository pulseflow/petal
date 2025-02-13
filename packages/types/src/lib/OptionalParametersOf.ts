import type { ParametersOf } from './ParamatersOf.ts';

export type OptionalParametersOf<
	T,
	Fallback extends readonly unknown[] = never,
> = [T] extends [never] ? Fallback
	: ParametersOf<T, Fallback> extends infer A extends readonly unknown[]
		? OptionalParametersOfWorker<A, Fallback>
		: Fallback;

type OptionalParametersOfWorker<A, Fallback extends readonly unknown[]> =
	A extends readonly [infer F, ...infer R]
		? IsEqual<
			Exclude<F, undefined>,
			F,
			OptionalParametersOfWorker<R, Fallback>,
			[F, ...OptionalParametersOfWorker<R, Fallback>]
		>
		: A;

type IsEqual<A, B, True = true, False = false> =
	// eslint-disable-next-line ts/no-unnecessary-type-parameters -- weird
	(<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? True
		: False;
