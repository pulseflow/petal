import { unindent } from '@flowr/utilities/unindent';
import { createEslintRule } from '../utils.ts';

export const RULE_NAME = 'indent-unindent';
export type MessageIds = 'indentUnindent';
export type Options = [{
	tags?: string[];
}];

const defaultOptions: Options = [{
	tags: ['$', 'unindent', 'unIndent'],
}];

export default createEslintRule<Options, MessageIds>({
	create: (context) => {
		const { tags = ['$', 'unindent', 'unIndent'] } = context.options[0];
		const tagSet = new Set(tags);

		return {
			TaggedTemplateExpression: (node) => {
				const id = node.tag;
				if (id.type !== 'Identifier')
					return;
				if (!tagSet.has(id.name))
					return;
				if (node.quasi.quasis.length !== 1)
					return;

				const quasi = node.quasi.quasis[0];
				const value = quasi.value.raw;
				const lineStartIndex = context.sourceCode.getIndexFromLoc({ column: 0, line: node.loc.start.line });
				const baseIndent = context.sourceCode.text.slice(lineStartIndex).match(/^\s*/)?.[0] ?? '';
				const final = `\n${unindent(value).split('\n').map(l => `${baseIndent}	${l}`).join('\n')}\n${baseIndent}`;

				if (final !== value)
					context.report({
						fix: fixer => fixer.replaceText(quasi, `\`${final}\``),
						messageId: 'indentUnindent',
						node: quasi,
					});
			},
		};
	},
	defaultOptions,
	meta: {
		docs: {
			description: 'Enforce consistent indentation in the `unindent` template tag',
		},
		fixable: 'code',
		messages: {
			indentUnindent: 'Consistent indentation in unindent tag',
		},
		schema: [
			{
				additionalProperties: false,
				properties: {
					tags: {
						default: defaultOptions[0].tags,
						items: {
							type: 'string',
						},
						type: 'array',
					},
				},
				type: 'object',
			},
		],
		type: 'layout',
	},
	name: RULE_NAME,
});
