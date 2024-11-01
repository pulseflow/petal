/**
 * Lazily creates a constant or load a module and caches it internally
 * @param cb The callback to lazily run
 * @returns The value returned by the callback, or the cached value if it was already initialised once.
 */
export function lazy<Return>(cb: () => Return) {
	let defaultValue: Return;
	return (): Return => (defaultValue ??= cb());
}
