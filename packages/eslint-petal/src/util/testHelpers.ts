import { RuleTester } from 'eslint';

export const createRuleTester = (): RuleTester => {
	return new RuleTester({
		parser: require.resolve('@typescript-eslint/parser'),
		parserOptions: {
			ecmaVersion: 2021,
			ecmaFeatures: {
				experimentalObjectRestSpread: true,
				jsx: true,
			},
			sourceType: 'module',
		},
	});
};
