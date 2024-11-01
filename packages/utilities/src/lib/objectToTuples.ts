import { isObject } from './isObject';

/**
 * Convert an object to a tuple
 * @param obj The object to convert
 * @param prefix The prefix for the key
 */
export function objectToTuples<Object extends object>(obj: Object, prefix = ''): Array<[keyof Object, Object[keyof Object]]> {
	const entries: Array<[keyof Object, Object[keyof Object]]> = [];

	for (const [key, value] of Object.entries(obj))
		if (isObject(value))
			entries.push(...objectToTuples(value, `${prefix}${key}.`));
		else
			entries.push([`${prefix}${key}` as keyof object, value as object[keyof object]]);

	return entries;
}
