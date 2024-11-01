export function objectValues<Object extends object>(obj: Object): Object extends ArrayLike<any> ? Array<Object[number]> : Array<Object[keyof Object]> {
	return Object.values(obj) as Object extends ArrayLike<infer Values> ? Values[] : Array<Object[keyof Object]>;
}
