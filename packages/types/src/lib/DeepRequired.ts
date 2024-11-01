import type { Builtin } from './Builtin';

export type DeepRequired<Type> = Type extends Builtin
	? NonNullable<Type>
	: Type extends Map<infer Key, infer Value>
		? Map<DeepRequired<Key>, DeepRequired<Value>>
		: Type extends ReadonlyMap<infer Key, infer Value>
			? ReadonlyMap<DeepRequired<Key>, DeepRequired<Value>>
			: Type extends WeakMap<infer Key, infer Value>
				? WeakMap<DeepRequired<Key>, DeepRequired<Value>>
				: Type extends Set<infer SetType>
					? Set<DeepRequired<SetType>>
					: Type extends ReadonlySet<infer ReadonlyType>
						? ReadonlySet<DeepRequired<ReadonlyType>>
						: Type extends WeakSet<infer SetType>
							? WeakSet<DeepRequired<SetType>>
							: Type extends Promise<infer PromiseType>
								? Promise<DeepRequired<PromiseType>>
								: Type extends object
									? { [Key in keyof Type]-?: DeepRequired<Type[Key]> }
									: NonNullable<Type>;
