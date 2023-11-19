import type { ConfigItem } from '../types.js';
import { pluginComments } from '../plugins.js';

export const comments = (): ConfigItem[] => [
	{
		name: 'petal:eslint-comments',
		plugins: {
			'eslint-comments': pluginComments,
		},
		rules: {
			'eslint-comments/no-aggregating-enable': 'error',
			'eslint-comments/no-duplicate-disable': 'error',
			'eslint-comments/no-unlimited-disable': 'error',
			'eslint-comments/no-unused-enable': 'error',
		},
	},
];
