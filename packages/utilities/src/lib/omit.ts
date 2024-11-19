export function omit<Object extends object, Key extends keyof Object>(obj: Object, ...keys: Key[]): Omit<Object, Key> {
	return Object.fromEntries(Object.entries(obj).filter(([key]) => !keys.includes(key as Key))) as Omit<Object, Key>;
}
