const isObject = (item: unknown): item is object => typeof item === 'object' && item !== null;
const hasLength = (item: object): item is { length: number } => 'length' in item && typeof item.length === 'number';
export const isValidLength = (length: number): boolean => Number.isSafeInteger(length) && length >= 0 && length < 2147483648;

export function isArrayLike(object: unknown): object is ArrayLike<unknown> {
	if (!isObject(object))
		return false;
	if (Array.isArray(object))
		return true;
	if (!hasLength(object))
		return false;
	if (!isValidLength(object.length))
		return false;

	return object.length === 0 || object.length - 1 in object;
}
