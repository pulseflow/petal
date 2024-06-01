export {};

// import { InferMessageIdsTypeFromRule, InferOptionsTypeFromRule } from '@typescript-eslint/utils/eslint-utils';
// import { createEslintRule, getESLintCoreRule } from '../utils';

// const baseRule = getESLintCoreRule('no-unused-vars');

// export const RULE_NAME = 'no-unused-vars';
// export type MessageIds = InferMessageIdsTypeFromRule<typeof baseRule>;
// export type Options = InferOptionsTypeFromRule<typeof baseRule>;

// export default createEslintRule<Options, MessageIds>({
// 	name: RULE_NAME,
// 	meta: {
// 		type: 'problem',
// 		docs: {
// 			description: 'Disallow unused variables',
// 			recommended: 'recommended',
// 			extendsBaseRule: true,
// 		},
// 		fixable: baseRule.meta.fixable,
// 		hasSuggestions: baseRule.meta.hasSuggestions,
// 		schema: baseRule.meta.schema,
// 		messages: baseRule.meta.messages,
// 	},
// 	defaultOptions: [{}],
// 	create: (context) => {

// 	},
// });
