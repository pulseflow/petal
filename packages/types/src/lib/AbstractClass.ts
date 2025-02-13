/* eslint-disable ts/no-empty-object-type -- intentionally use {} for constructor impl */
import type { AbstractConstructor } from './AbstractConstructor.ts';

export type AbstractClass<
	Prototype extends object | null = any,
	Args extends readonly unknown[] = readonly any[],
	Static extends {} = {},
> =
	& AbstractConstructor<Prototype, Args>
	& { readonly prototype: Prototype }
	& (
		{} extends Static ? unknown
			: {
					[K in keyof Static as[Static[K]] extends [never] ? never : K]:
						& ThisType<AbstractClass<Prototype, Args, Static>>
						& Static[K];
				}
	);
