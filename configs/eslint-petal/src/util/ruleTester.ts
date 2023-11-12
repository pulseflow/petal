import { RuleTester } from '@typescript-eslint/rule-tester';

export const createRuleTester = (): RuleTester => {
	return new RuleTester({
		parser: '@typescript-eslint/parser',
		parserOptions: {
			ecmaVersion: 2022,
			ecmaFeatures: {
				jsx: true,
			},
			sourceType: 'module',
		},
	});
};
