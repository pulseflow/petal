export function hasKeyInObj(key: string,	obj: { [s: string]: any } = {}): boolean {
	const [k, ...restOfK] = key.split('.');
	if (restOfK.length === 0)
		return Object.keys(obj).includes(k);

	const nextObj = obj[k];
	if (!(nextObj instanceof Object))
		return false;

	return hasKeyInObj(restOfK.join('.'), nextObj);
}
