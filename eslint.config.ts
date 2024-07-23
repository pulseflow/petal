import { defineConfig } from '@flowr/eslint-config';

export default defineConfig(
	{
		typescript: true,
		astro: false,
		type: 'lib',
	},
	{
		name: 'user/ignores/fixtures',
		ignores: [
			'fixtures',
			'_fixtures',
			'**/_fixtures/**',
			'**/fixtures/**',
		],
	},
	{
		name: 'user/perfectionist/sort',
		files: ['packages/eslint-config/src/**/*.ts'],
		rules: {
			'perfectionist/sort-objects': 'error',
		},
	},
	{
		name: 'user/test/indent',
		files: ['packages/eslint-plugin/src/rules/**/*.test.ts'],
		rules: {
			'petal/indent-unindent': 'error',
		},
	},
);
