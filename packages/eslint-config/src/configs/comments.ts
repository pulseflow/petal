import { interopDefault } from '../utils';
import type { TypedFlatConfigItem } from '../types';

export async function comments(): Promise<TypedFlatConfigItem[]> {
	return [
		{
			name: 'petal/eslint-comments/rules',
			plugins: {
				'eslint-comments': await interopDefault(import('@eslint-community/eslint-plugin-eslint-comments')),
			},
			rules: {
				'eslint-comments/no-aggregating-enable': 'error',
				'eslint-comments/no-duplicate-disable': 'error',
				'eslint-comments/no-unlimited-disable': 'error',
				'eslint-comments/no-unused-enable': 'error',
				'eslint-comments/require-description': 'error',
			},
		},
	];
}
