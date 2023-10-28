import { createRule } from '../../util/createRule.js';
import { ESLintUtils } from '@typescript-eslint/utils';

const discouragedWords = ['blacklist', 'whitelist'];

const rule = createRule({
	create: context => {
		return {
			Program(): void {
				const comments = context.sourceCode.getAllComments();
				comments.forEach(comment => {
					const nodeText = comment.value;
					const nodeViolation = discouragedWords.find(word =>
						nodeText.match(new RegExp(word, 'i')),
					);

					if (!nodeViolation) return;

					context.report({
						messageId: 'disallowed',
						node: comment,
					});
				});
			},

			Identifier(node) {
				const nodeName = node.name;
				const nodeViolation = discouragedWords.find(word =>
					nodeName.match(new RegExp(word, 'i')),
				);

				if (!nodeViolation) return;

				context.report({
					messageId: 'disallowed',
					node: node,
				});
			},
		};
	},
	name: 'no-discouraged-words',
	meta: {
		docs: {
			description: 'Prevent use of discouraged words.',
		},
		messages: {
			disallowed:
				'Usage of this word is strongly discouraged. Please use an alternative.',
		},
		schema: [],
		fixable: 'code',
		type: 'suggestion',
	},
	defaultOptions: [],
});

export default rule;
