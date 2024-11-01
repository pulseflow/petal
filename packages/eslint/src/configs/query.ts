import type { OptionsQuery, TypedFlatConfigItem } from '../types/index.ts';
import { GLOB_SRC } from '../globs.ts';
import { ensurePackages, interopDefault } from '../utils.ts';

export async function query(options: OptionsQuery = {}): Promise<TypedFlatConfigItem[]> {
	await ensurePackages(['@tanstack/eslint-plugin-query']);
	const pluginQuery = await interopDefault(import('@tanstack/eslint-plugin-query'));

	return [
		{
			name: 'petal/query/setup',
			plugins: {
				query: pluginQuery,
			},
		},
		{
			files: options.files ?? [GLOB_SRC],
			name: 'petal/query/rules',
			rules: {
				'query/exhaustive-deps': 'error',
				'query/no-rest-destructuring': 'error',
				'query/no-unstable-deps': 'error',
				'query/stable-query-client': 'error',

				...options.overrides ?? {},
			},
		},
	];
}
