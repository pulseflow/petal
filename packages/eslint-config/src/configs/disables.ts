import type { TypedFlatConfigItem } from '../types';
import { GLOB_BIN, GLOB_BIN_SRC, GLOB_CJS, GLOB_CLI, GLOB_CLI_SRC, GLOB_DTS, GLOB_SCRIPTS, GLOB_TEST_TS } from '../globs';

export async function disables(): Promise<TypedFlatConfigItem[]> {
	return [
		{
			files: [GLOB_SCRIPTS],
			name: 'petal/disables/scripts',
			rules: {
				'no-console': 'off',
				'ts/explicit-function-return-type': 'off',
			},
		},
		{
			files: [GLOB_CLI, GLOB_CLI_SRC],
			name: 'petal/disables/cli',
			rules: {
				'no-console': 'off',
			},
		},
		{
			files: [GLOB_BIN, GLOB_BIN_SRC],
			name: 'petal/disables/bin',
			rules: {
				'petal/no-import-dist': 'off',
				'petal/no-import-node-modules-by-path': 'off',
			},
		},
		{
			files: [GLOB_DTS],
			name: 'petal/disables/dts',
			rules: {
				'eslint-comments/no-unlimited-disable': 'off',
				'import/no-duplicates': 'off',
				'no-restricted-syntax': 'off',
				'unused-imports/no-unused-vars': 'off',
			},
		},
		{
			files: [GLOB_TEST_TS],
			name: 'petal/disables/tests',
			rules: {
				'no-unused-expressions': 'off',
			},
		},
		{
			files: [GLOB_CJS],
			name: 'petal/disables/cjs',
			rules: {
				'ts/no-require-imports': 'off',
			},
		},
	];
}
