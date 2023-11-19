import type { ConfigItem } from '../types.js';
import { GLOB_EXCLUDE } from '../globs.js';

export const ignores = (): ConfigItem[] => [
	{
		ignores: GLOB_EXCLUDE,
	},
];
