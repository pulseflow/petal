export function objectEntries<T extends object>(obj: T): T extends ArrayLike<infer Values> ? Array<[`${number}`, Values]> : Array<[keyof T, T[keyof T]]> {
	return Object.entries(obj) as T extends ArrayLike<infer Values> ? Array<[`${number}`, Values]> : Array<[keyof T, T[keyof T]]>;
}
