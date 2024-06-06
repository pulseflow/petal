declare module 'eslint/use-at-your-own-risk' {
	export interface RuleMap {
		'no-unused-vars': typeof import('eslint/lib/rules/no-unused-vars');
	}

	export const builtinRules: {
		get: <K extends keyof RuleMap>(key: K) => RuleMap[K] | undefined;
	} & Map<string, import('eslint').Rule.RuleModule>;
}

declare module 'eslint/lib/rules/no-unused-vars' {
	import type { TSESLint, TSESTree } from '@typescript-eslint/utils';

	const rule: TSESLint.RuleModule<
		'unusedVar',
		[
			| 'all'
			| 'local'
			| {
				vars?: 'all' | 'local';
				varsIgnorePattern?: string;
				args?: 'after-used' | 'all' | 'none';
				ignoreRestSiblings?: boolean;
				argsIgnorePattern?: string;
				caughtErrors?: 'all' | 'none';
				caughtErrorsIgnorePattern?: string;
				destructuredArrayIgnorePattern?: string;
			},
		],
		{
			ArrowFunctionExpression: (node: TSESTree.ArrowFunctionExpression) => void;
		}
	>;
	export = rule;
}
