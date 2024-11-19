import type { Strings } from '@flowr/types';
import { toString } from './toString';

export function untemplate<Template extends Strings, Key = any>(strings: Template, keys: Key[], stringify = (key: Key) => toString(key)): string {
	if (keys.length === 0)
		return strings.join(' ');

	return strings.reduce((acc, curr, idx) => {
		const key = keys[idx];

		if (key)
			return acc + curr + stringify(key);
		else return acc + curr;
	}, '');
}
