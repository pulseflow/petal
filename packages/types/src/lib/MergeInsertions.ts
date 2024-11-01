export type MergeInsertions<Type> =
	Type extends object
		? { [Key in keyof Type]: MergeInsertions<Type[Key]> }
		: Type;
