/**
 * An object that is shaped like an `Error`.
 *
 * @public
 */
export interface ErrorLike {
	name: string
	message: string
	stack?: string
	[unknownKeys: string]: unknown
}

/**
 * Checks whether an unknown value is an {@link ErrorLike} object, which guarantees that it's
 * an object that has at least two string properties: a non-empty `name` and `message`.
 *
 * @public
 * @param value - an unknown value
 * @returns true if the value is an {@link ErrorLike} object, false otherwise
 */
export function isError(value: unknown): value is ErrorLike {
	if (typeof value !== 'object' || value === null || Array.isArray(value))
		return false;

	const maybe = value as Partial<ErrorLike>;
	if (typeof maybe.name !== 'string' || maybe.name === '')
		return false;
	if (typeof maybe.message !== 'string')
		return false;

	return true;
}

/**
 * Asserts that an unknown value is an {@link ErrorLike} object, which guarantees that it's
 * an object that has at least two string properties: a non-empty `name` and `message`.
 *
 * If the value is not an {@link ErrorLike} object, an error is thrown.
 *
 * @public
 * @param value - an unknown value
 */
export function assertError(value: unknown): asserts value is ErrorLike {
	if (typeof value !== 'object' || value === null || Array.isArray(value)) {
		throw new Error(
			`encountered invalid error, not an object, got '${value}'`,
		);
	}

	const maybe = value as Partial<ErrorLike>;
	if (typeof maybe.name !== 'string' || maybe.name === '') {
		throw new Error(
			`encountered error object without a name, got '${value}'`,
		);
	}
	if (typeof maybe.message !== 'string') {
		throw new TypeError(
			`encountered error object without a msg, got '${value}'`,
		);
	}
}
