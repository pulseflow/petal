/* eslint-disable ts/no-empty-object-type -- intentionally use {} for constructor impl */
import type { Constructor } from './Constructor.ts';

export type Class<
	Prototype extends object | null = any,
	Args extends readonly unknown[] = readonly any[],
	Static extends {} = {},
> =
	& Constructor<Prototype, Args>
	& { readonly prototype: Prototype }
	& ({} extends Static ? unknown : {
		[K in keyof Static as[Static[K]] extends [never] ? never : K]:
			& ThisType<Class<Prototype, Args, Static>>
			& Static[K];
	});
