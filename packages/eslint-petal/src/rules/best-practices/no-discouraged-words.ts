import { Rule } from 'eslint';
import { TSESTree } from '@typescript-eslint/types';
import { createDocsUrl } from '../../util/helpers';

/**
 * List of discouraged words in the form of RegEx (regular expressions).
 */
const discouragedWords = ['blacklist', 'whitelist'];

const rule: Rule.RuleModule = {
	meta: {
		docs: {
			category: 'Best Practices',
			description: 'Prevent use of discouraged words.',
			url: createDocsUrl('best-practices/no-discouraged-words.md'),
		},
		schema: [],
		fixable: 'code',
		type: 'suggestion',
	},
	create(context: Rule.RuleContext) {
		return {
			// This checks all the JS comments for use of discouraged word. This line is an example of a comment.
			Program(): void {
				const comments = context.getSourceCode().getAllComments();
				comments.forEach(comment => {
					const commentText = comment.value;
					const commentTextViolation = discouragedWords.find(word =>
						commentText.match(new RegExp(word, 'i')),
					);

					if (!commentTextViolation) {
						// There is no violation here.
						return;
					}

					context.report({
						// @ts-ignore
						node: comment,
						message: `Usage of the word "${commentTextViolation}" is strongly discouraged. Please use a different word.`,
					});
				});
			},

			// This checks all the JS syntax for use of discouraged words.
			Identifier(node: TSESTree.Identifier) {
				const variableName = node.name;
				const variableNameViolation = discouragedWords.find(word =>
					variableName.match(new RegExp(word, 'i')),
				);

				if (!variableNameViolation) {
					// There is no violation here
					return;
				}

				// Report it as an error to ESLint
				context.report({
					node,
					message: `Usage of the word "${variableNameViolation}" is strongly discouraged. Please use a different word.`,
				});
			},
		} as Rule.RuleListener;
	},
};

export default rule;
