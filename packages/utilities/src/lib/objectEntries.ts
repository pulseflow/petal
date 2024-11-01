export function objectEntries<Object extends object>(obj: Object): Object extends ArrayLike<any> ? Array<[`${number}`, Object[number]]> : Array<[keyof Object, Object[keyof Object]]> {
	return Object.entries(obj) as Object extends ArrayLike<infer Values> ? Values[] : Array<[keyof Object, Object[keyof Object]]>;
}
