import type { TypedFlatConfigItem } from '../types/index.ts';
import { GLOB_EXCLUDE } from '../globs.ts';

export async function ignores(userIgnores: string[] = []): Promise<TypedFlatConfigItem[]> {
	return [
		{
			ignores: [
				...GLOB_EXCLUDE,
				...userIgnores,
			],
			name: 'petal/ignores',
		},
	];
}
