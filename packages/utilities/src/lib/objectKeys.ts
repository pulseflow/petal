export function objectKeys<Object extends object>(obj: Object): Object extends ArrayLike<any> ? Array<`${number}`> : Array<keyof Object> {
	return Object.keys(obj) as Object extends ArrayLike<infer Values> ? Values[] : Array<keyof Object>;
}
