import { toString } from './index';

export function getTypeName(v: any): string {
	if (v === null)
		return 'null';
	const type = toString(v).slice(8, -1).toLowerCase();
	return (typeof v === 'object' || typeof v === 'function') ? type : typeof v;
}

export function isDeepEqual(value1: any, value2: any): boolean {
	const type1 = getTypeName(value1);
	const type2 = getTypeName(value2);
	if (type1 !== type2)
		return false;

	if (type1 === 'array') {
		if (value1.length !== value2.length)
			return false;

		return value1.every((item: any, i: number) => {
			return isDeepEqual(item, value2[i]);
		});
	}
	if (type1 === 'object') {
		const keyArr = Object.keys(value1);
		if (keyArr.length !== Object.keys(value2).length)
			return false;

		return keyArr.every((key: string) => {
			return isDeepEqual(value1[key], value2[key]);
		});
	}
	return Object.is(value1, value2);
}

export async function gen2array<T>(gen: AsyncIterable<T>): Promise<T[]> {
	const out: T[] = [];
	for await (const x of gen) out.push(x);

	return out;
}
