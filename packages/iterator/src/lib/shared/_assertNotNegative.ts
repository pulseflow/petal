export function assertNotNegative(value: number, original: unknown): number {
	if (value < 0)
	// eslint-disable-next-line ts/restrict-template-expressions -- logging assertions
		throw new RangeError(`${original} must be a non-negative number`);

	return value;
}
