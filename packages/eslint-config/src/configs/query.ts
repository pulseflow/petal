import type { OptionsFiles, OptionsOverrides, TypedFlatConfigItem } from '../types';
import { GLOB_SRC } from '../globs';
import { ensurePackages, interopDefault } from '../utils';

export async function query(options: OptionsOverrides & OptionsFiles = {}): Promise<TypedFlatConfigItem[]> {
	const { files = [GLOB_SRC], overrides = {} } = options;
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
			files,
			name: 'petal/query/rules',
			rules: {
				'query/exhaustive-deps': 'error',
				'query/no-rest-destructuring': 'error',
				'query/stable-query-client': 'error',

				...overrides,
			},
		},
	];
}
