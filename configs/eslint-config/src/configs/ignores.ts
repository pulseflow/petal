import type { FlatConfigItem } from '../types.js';
import { GLOB_EXCLUDE } from '../globs.js';

export async function ignores(): Promise<FlatConfigItem[]> {
	return [
		{
			ignores: GLOB_EXCLUDE,
		},
	];
}
