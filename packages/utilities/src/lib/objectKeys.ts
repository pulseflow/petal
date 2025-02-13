export function objectKeys<T extends object>(obj: T): T extends ArrayLike<any> ? Array<`${number}`> : Array<keyof T> {
	return Object.keys(obj) as T extends ArrayLike<any> ? Array<`${number}`> : Array<keyof T>;
}
