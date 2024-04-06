import type { TypedFlatConfigItem } from '../types.js';
import { pluginComments } from '../plugins.js';

export async function comments(): Promise<TypedFlatConfigItem[]> {
	return [
		{
			name: 'petal/eslint-comments/rules',
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
}
