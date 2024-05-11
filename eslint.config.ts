// @ts-expect-error missing types
import styleMigrate from '@stylistic/eslint-plugin-migrate';
import { petal } from '@flowr/eslint-config';

export default petal(
	{
		typescript: true,
	},
	{
		ignores: [
			'fixtures',
			'_fixtures',
			'**/_fixtures/**',
			'**/fixtures/**',
		],
	},
	{
		files: ['packages/eslint-config/src/**/*.ts'],
		rules: {
			'perfectionist/sort-objects': 'error',
		},
	},
	{
		files: ['packages/eslint-config/src/configs/*.ts'],
		plugins: {
			'style-migrate': styleMigrate,
		},
		rules: {
			'style-migrate/migrate': ['error', { namespaceTo: 'style' }],
		},
	},
	{
		name: 'tests',
		files: ['packages/eslint-plugin/src/rules/**/*.test.ts'],
		rules: {
			'petal/indent-unindent': 'error',
		},
	},
);
