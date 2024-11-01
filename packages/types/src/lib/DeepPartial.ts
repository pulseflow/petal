export type DeepPartial<Type> = {
	[Key in keyof Type]?: Type[Key] extends Array<infer PartialType>
		? Array<DeepPartial<PartialType>>
		: Type[Key] extends ReadonlyArray<infer PartialType>
			? ReadonlyArray<DeepPartial<PartialType>>
			: DeepPartial<Type[Key]>;
};
