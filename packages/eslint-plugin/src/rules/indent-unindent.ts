import { unindent } from '@flowr/utils';
import { createEslintRule } from '../utils';

export const RULE_NAME = 'indent-unindent';
export type MessageIds = 'indent-unindent';
export type Options = [{
	tags?: string[];
}];

export default createEslintRule<Options, MessageIds>({
	name: RULE_NAME,
	meta: {
		type: 'layout',
		docs: {
			description: 'Enforce consistent indentation in the `unindent` template tag',
		},
		fixable: 'code',
		schema: [
			{
				type: 'object',
				properties: {
					tags: {
						type: 'array',
						items: {
							type: 'string',
						},
					},
				},
				additionalProperties: false,
			},
		],
		messages: {
			'indent-unindent': 'Consistent indentation in unindent tag',
		},
	},
	defaultOptions: [{}],
	create: (context) => {
		const { tags = ['$', 'unindent', 'unIndent'] } = context.options?.[0] ?? {};

		return {
			TaggedTemplateExpression: (node) => {
				const id = node.tag;
				if (!id || id.type !== 'Identifier')
					return;
				if (!tags.includes(id.name))
					return;
				if (node.quasi.quasis.length !== 1)
					return;
				const quasi = node.quasi.quasis[0];
				const value = quasi.value.raw;
				const lineStartIndex = context.sourceCode.getIndexFromLoc({ line: node.loc.start.line, column: 0 });
				const baseIndent = context.sourceCode.text.slice(lineStartIndex).match(/^\s*/)?.[0] ?? '';
				const targetIndent = `${baseIndent}	`;
				const pure: string = unindent([value] as any);
				let final = pure.split('\n').map(l => targetIndent + l).join('\n');

				final = `\n${final}\n${baseIndent}`;

				if (final !== value)
					context.report({
						node: quasi,
						messageId: 'indent-unindent',
						fix: fixer => fixer.replaceText(quasi, `\`${final}\``),
					});
			},
		};
	},
});
