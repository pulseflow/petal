import type { AbstractConstructor } from './AbstractConstructor';
import type { Builtin } from './Builtin';

export type DeepReadonly<Type> = Type extends Builtin
	? Type
	: Type extends AbstractConstructor<unknown> | ((...args: unknown[]) => unknown)
		? Type
		: Type extends ReadonlyMap<infer Key, infer Value>
			? ReadonlyMap<DeepReadonly<Key>, DeepReadonly<Value>>
			: Type extends ReadonlySet<infer ReadonlyType>
				? ReadonlySet<DeepReadonly<ReadonlyType>>
				: Type extends readonly [] | readonly [...never[]]
					? readonly []
					: Type extends readonly [infer U, ...infer V]
						? readonly [DeepReadonly<U>, ...DeepReadonly<V>]
						: Type extends readonly [...infer U, infer V]
							? readonly [...DeepReadonly<U>, DeepReadonly<V>]
							: Type extends ReadonlyArray<infer ReadonlyType>
								? ReadonlyArray<DeepReadonly<ReadonlyType>>
								: Type extends object
									? { readonly [Key in keyof Type]: DeepReadonly<Type[Key]> }
									: unknown;
