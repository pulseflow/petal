import type { ConfigItem } from '../types.js';
import { GLOB_EXCLUDE } from '../globs.js';

export function ignores(): ConfigItem[] {
	return [
		{
			ignores: GLOB_EXCLUDE,
		},
	];
}
