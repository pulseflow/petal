export type MergeLeft<A, B> = {
	[Key in keyof A | keyof B]: Key extends keyof A ? A[Key]
		: Key extends keyof B ? B[Key]
			: never;
};
