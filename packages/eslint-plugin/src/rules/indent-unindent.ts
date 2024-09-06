import { unindent } from '@flowr/utils';
import { createEslintRule } from '../utils';

export const RULE_NAME = 'indent-unindent';
export type MessageIds = 'indentUnindent';
export type Options = [{
	tags?: string[];
}];

const defaultOptions: Options = [{
	tags: ['$', 'unindent', 'unIndent'],
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
						default: defaultOptions[0].tags,
					},
				},
				additionalProperties: false,
			},
		],
		messages: {
			indentUnindent: 'Consistent indentation in unindent tag',
		},
	},
	defaultOptions,
	create: (context) => {
		const { tags = ['$', 'unindent', 'unIndent'] } = context.options?.[0] ?? {};
		const tagSet = new Set(tags);

		return {
			TaggedTemplateExpression: (node) => {
				const id = node.tag;
				if (!id || id.type !== 'Identifier')
					return;
				if (!tagSet.has(id.name))
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
						messageId: 'indentUnindent',
						fix: fixer => fixer.replaceText(quasi, `\`${final}\``),
					});
			},
		};
	},
});
