export type Merge<A, B> = {
	[Key in keyof A | keyof B]:
	Key extends keyof A & keyof B
		? A[Key] | B[Key]
		: Key extends keyof B ? B[Key]
			: Key extends keyof A ? A[Key]
				: never;
};
