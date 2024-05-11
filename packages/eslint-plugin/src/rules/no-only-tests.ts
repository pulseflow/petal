// adapted from https://github.com/levibuzolic/eslint-plugin-no-only-tests/blob/main/rules/no-only-tests.js

import { createEslintRule } from '../utils';

export const RULE_NAME = 'no-only-tests';
export type MessageIds = 'no-only-tests';
export type Options = [{
	/// blocks
	objects?: string[];
	/// focuses
	properties?: string[];
}];

export default createEslintRule<Options, MessageIds>({
	name: RULE_NAME,
	meta: {
		type: 'suggestion',
		docs: {
			description: 'disallow `.only` blocks in testing',
		},
		fixable: 'code',
		schema: [
			{
				type: 'object',
				properties: {
					objects: {
						type: 'array',
						items: {
							type: 'string',
						},
						uniqueItems: true,
					},
					properties: {
						type: 'array',
						items: {
							type: 'string',
						},
						uniqueItems: true,
					},
				},
				additionalProperties: true,
			},
		],
		messages: {
			'no-only-tests': 'Test should not use the .only() callpath {{callpath}}',
		},
	},
	defaultOptions: [{}],
	create: (context) => {
		const {
			objects = ['describe', 'it', 'context', 'tape', 'fixture', 'serial', 'expect', 'Feature', 'Scenario', 'Given', 'And', 'When', 'Then'],
			properties = ['only'],
		} = context.options?.[0] ?? {};

		return {
			MemberExpression: (node) => {
				if (!(node.object && node.object.type === 'Identifier'))
					return;
				if (!(node.property && node.property.type === 'Identifier'))
					return;

				if (properties.includes(node.property.name)) {
					let currentNode: any = node;
					const callPath = [];
					while (currentNode && currentNode.type === 'MemberExpression') {
						callPath.unshift((currentNode.property as any).name);
						currentNode = currentNode.object;
					}
					if (currentNode && currentNode.type === 'Identifier' && objects.includes(currentNode.name))
						context.report({ node, messageId: 'no-only-tests', data: { callpath: callPath.join('.') }, fix: fixer => fixer.removeRange([node.range[0] - 1, node.range[1]]) });
				}
			},
		};
	},
});
