import type { TypedFlatConfigItem } from '../types.js';
import { GLOB_EXCLUDE } from '../globs.js';

export async function ignores(): Promise<TypedFlatConfigItem[]> {
	return [
		{
			ignores: GLOB_EXCLUDE,
		},
	];
}
