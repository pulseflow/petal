import type { TypedFlatConfigItem } from '../types.js';
import { pluginPerfectionist } from '../plugins.js';

/**
 * Optional perfectionist plugin for props and items sorting.
 *
 * @see https://github.com/azat-io/eslint-plugin-perfectionist
 */
export async function perfectionist(): Promise<TypedFlatConfigItem[]> {
	return [
		{
			name: 'petal/perfectionist/setup',
			plugins: {
				perfectionist: pluginPerfectionist,
			},
		},
	];
}
