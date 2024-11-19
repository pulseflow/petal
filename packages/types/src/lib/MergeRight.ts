export type MergeRight<A, B> = {
	[Key in keyof A | keyof B]: Key extends keyof B ? B[Key]
		: Key extends keyof A ? A[Key]
			: never;
};
