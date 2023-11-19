import type { ConfigItem } from '../types.js';
import { pluginPerfectionist } from '../plugins.js';

/**
 * Optional perfectionist plugin for props and items sorting.
 *
 * @see https://github.com/azat-io/eslint-plugin-perfectionist
 */
export const perfectionist = (): ConfigItem[] => [
	{
		name: 'petal:perfectionist',
		plugins: {
			perfectionist: pluginPerfectionist,
		},
	},
];
