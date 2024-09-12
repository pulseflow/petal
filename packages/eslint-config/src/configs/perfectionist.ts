import type { TypedFlatConfigItem } from '../types';
import { interopDefault } from '../utils';

/**
 * Perfectionist plugin for props and items sorting.
 *
 * @see https://github.com/azat-io/eslint-plugin-perfectionist
 */
export async function perfectionist(): Promise<TypedFlatConfigItem[]> {
	return [
		{
			name: 'petal/perfectionist/setup',
			plugins: {
				perfectionist: await interopDefault(import('eslint-plugin-perfectionist')),
			},
			rules: {
				'perfectionist/sort-array-includes': ['error', { order: 'asc', type: 'natural' }],
				'perfectionist/sort-exports': ['error', { order: 'asc', type: 'natural' }],
				'perfectionist/sort-imports': ['error', {
					groups: [
						'type',
						['parent-type', 'sibling-type', 'index-type'],

						'builtin',
						'external',
						['internal', 'internal-type'],
						['parent', 'sibling', 'index'],
						'side-effect',
						'object',
						'unknown',
					],
					newlinesBetween: 'ignore',
					order: 'asc',
					type: 'natural',
				}],
				'perfectionist/sort-named-exports': ['error', { order: 'asc', type: 'natural' }],
				'perfectionist/sort-named-imports': ['error', { order: 'asc', type: 'natural' }],
				'perfectionist/sort-sets': ['error', { order: 'asc', type: 'natural' }],
			},
		},
	];
}
