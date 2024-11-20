import { createEslintRule } from '../utils.ts';

export const RULE_NAME = 'if-newline';
export type MessageIds = 'missingIfNewline';
export type Options = [];

export default createEslintRule<Options, MessageIds>({
	create: context => ({
		IfStatement: (node) => {
			if (node.consequent.type === 'BlockStatement')
				return;
			if (node.test.loc.end.line === node.consequent.loc.start.line)
				context.report({
					fix: f => f.replaceTextRange([node.consequent.range[0], node.consequent.range[0]], '\n'),
					loc: {
						end: node.consequent.loc.start,
						start: node.test.loc.end,
					},
					messageId: 'missingIfNewline',
					node,
				});
		},
	}),
	defaultOptions: [],
	meta: {
		docs: {
			description: 'Newline after if',
		},
		fixable: 'whitespace',
		messages: {
			missingIfNewline: 'Expect newline after if',
		},
		schema: [],
		type: 'layout',
	},
	name: RULE_NAME,
});
