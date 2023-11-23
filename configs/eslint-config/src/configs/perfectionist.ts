import type { FlatConfigItem } from '../types.js';
import { pluginPerfectionist } from '../plugins.js';

/**
 * Optional perfectionist plugin for props and items sorting.
 *
 * @see https://github.com/azat-io/eslint-plugin-perfectionist
 */
export async function perfectionist(): Promise<FlatConfigItem[]> {
	return [
		{
			name: 'petal:perfectionist',
			plugins: {
				perfectionist: pluginPerfectionist,
			},
		},
	];
}
