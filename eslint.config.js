// @ts-check
import petal from '@flowr/eslint-config';
import styleMigrate from '@stylistic/eslint-plugin-migrate';

export default petal(
	{
		typescript: true,
	},
	{
		ignores: [
			'fixtures',
			'_fixtures',
			'**/fixtures/**',
		],
	},
	// @ts-expect-error perfectionist type error
	{
		files: ['configs/eslint-config/src/**/*.ts'],
		rules: {
			'perfectionist/sort-objects': 'error',
		},
	},
	{
		files: ['configs/eslint-config/src/configs/*.ts'],
		plugins: {
			'style-migrate': styleMigrate,
		},
		rules: {
			'style-migrate/migrate': ['error', { namespaceTo: 'style' }],
		},
	},
);
