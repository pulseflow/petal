import type { TypedFlatConfigItem } from '../types/index.ts';
import { interopDefault } from '../utils.ts';

interface SortConfig {
	type?: ('alphabetical' | 'natural' | 'line-length');
	order?: ('asc' | 'desc');

}

const sortConfig: SortConfig = { order: 'asc', type: 'natural' };

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
				'perfectionist/sort-array-includes': ['error', sortConfig],
				'perfectionist/sort-exports': ['error', sortConfig],
				'perfectionist/sort-imports': ['error', {
					...sortConfig,
					groups: [
						'type',
						['parent-type', 'sibling-type', 'index-type', 'internal-type'],

						'builtin',
						'external',
						'internal',
						['parent', 'sibling', 'index'],
						'side-effect',
						'object',
						'unknown',
					],
					newlinesBetween: 'ignore',
				}],
				'perfectionist/sort-named-exports': ['error', sortConfig],
				'perfectionist/sort-named-imports': ['error', sortConfig],
				'perfectionist/sort-sets': ['error', sortConfig],
			},
		},
	];
}
