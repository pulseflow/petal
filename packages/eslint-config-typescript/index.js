import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

/** @type {import('eslint').Linter.FlatConfig} */
export default {
	...ts.configs['recommended'],
	...ts.configs['eslint-recommended'],
	languageOptions: {
		parser: tsParser,
		parserOptions: {
			ecmaFeatures: {
				modules: true,
			},
			ecmaVersion: 'latest',
			sourceType: 'module',
		},
	},
	plugins: {
		'@typescript-eslint': ts,
		ts,
	},
	rules: {
		// camelcase interference fix.
		camelcase: 'off',
		'@typescript-eslint/naming-convention': 'off',
		// indent interference fix.
		indent: 'off',
		'@typescript-eslint/indent': ['error', 2, { SwitchCase: 1 }],
		// no-array-constructor interference fix.
		'no-array-constructor': 'off',
		'@typescript-eslint/no-array-constructor': 'error',
		// no-unused-vars interference fix.
		'no-unused-vars': 'off',
		'@typescript-eslint/no-unused-vars': 'off',
		// no-useless-constructor interference fix.
		'no-useless-constructor': 'off',
		'@typescript-eslint/no-useless-constructor': 'error',
		// semi interference fix.
		semi: 'off',
		'@typescript-eslint/semi': 'warn',
		// no-shadow interference fix.
		'no-shadow': 'off',
		'@typescript-eslint/no-shadow': 'error',
		// no-redeclare interference fix.
		'no-redeclare': 'off',
		'@typescript-eslint/no-redeclare': 'error',
		// no-use-before-define interference fix.
		// allow functions to be defined after they're used
		'no-use-before-define': 'off',
		'@typescript-eslint/no-use-before-define': ['error', 'nofunc'],
	},
};
