import { createEslintRule } from '../utils';

export const RULE_NAME = 'if-newline';
export type MessageIds = 'missingIfNewline';
export type Options = [];

export default createEslintRule<Options, MessageIds>({
	name: RULE_NAME,
	meta: {
		type: 'layout',
		docs: {
			description: 'Newline after if',
			recommended: 'stylistic',
		},
		fixable: 'whitespace',
		schema: [],
		messages: {
			missingIfNewline: 'Expect newline after if',
		},
	},
	defaultOptions: [],
	create: (context) => {
		return {
			IfStatement(n) {
				if (!n.consequent)
					return;
				if (n.consequent.type === 'BlockStatement')
					return;
				if (n.test.loc.end.line === n.consequent.loc.start.line)
					context.report({
						node: n,
						loc: {
							start: n.test.loc.end,
							end: n.consequent.loc.start,
						},
						messageId: 'missingIfNewline',
						fix: f => f.replaceTextRange([n.consequent.range[0], n.consequent.range[0]], '\n'),
					});
			},
		};
	},
});
