export function pick<Object extends object, Key extends keyof Object>(obj: Object, ...keys: Key[]): Pick<Object, Key> {
	return Object.fromEntries(Object.entries(obj).filter(([key]) => keys.includes(key as Key))) as Pick<Object, Key>;
}
