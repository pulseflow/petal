export function assertNotNegative(value: number, _original: unknown): number {
	if (value < 0)
		throw new RangeError(`original must be a non-negative number`);

	return value;
}
