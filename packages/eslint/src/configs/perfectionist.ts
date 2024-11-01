import type { TypedFlatConfigItem } from '../types/index.ts';
import { interopDefault } from '../utils.ts';

type SortConfig = ['error', {
	type?: ('alphabetical' | 'natural' | 'line-length');
	order?: ('asc' | 'desc');
}];

/**
 * Perfectionist plugin for props and items sorting.
 *
 * @see https://github.com/azat-io/eslint-plugin-perfectionist
 */
export async function perfectionist(): Promise<TypedFlatConfigItem[]> {
	const sortConfig: SortConfig = ['error', { order: 'asc', type: 'natural' }];

	return [
		{
			name: 'petal/perfectionist/setup',
			plugins: {
				perfectionist: await interopDefault(import('eslint-plugin-perfectionist')),
			},
			rules: {
				'perfectionist/sort-array-includes': sortConfig,
				'perfectionist/sort-exports': sortConfig,
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
				'perfectionist/sort-named-exports': sortConfig,
				'perfectionist/sort-named-imports': sortConfig,
				'perfectionist/sort-sets': sortConfig,
			},
		},
	];
}
