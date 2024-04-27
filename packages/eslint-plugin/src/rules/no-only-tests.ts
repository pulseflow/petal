// adapted from https://github.com/levibuzolic/eslint-plugin-no-only-tests/blob/main/rules/no-only-tests.js

import type { JSONSchema4 } from '@typescript-eslint/utils/json-schema';
import { createEslintRule } from '../utils';

export const RULE_NAME = 'no-only-tests';
export type MessageIds = 'noOnlyTests';
export type Options = [{
	objects: string[];
	properties: string[];
}];

const defaultOptions: Options = [{
	objects: ['describe', 'it', 'context', 'tape', 'fixture', 'serial', 'Feature', 'Scenario', 'Given', 'And', 'When', 'Then'],
	properties: ['only'],
}];

export default createEslintRule<Options, MessageIds>({
	name: RULE_NAME,
	meta: {
		type: 'suggestion',
		docs: {
			description: 'disallow `.only` blocks in testing',
			recommended: 'stylistic',
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
				} satisfies Record<keyof Options[0], JSONSchema4>,
				additionalProperties: true,
			},
		],
		messages: {
			noOnlyTests: 'Test should not use the .only() callpath, not {{callpath}}',
		},
	},
	defaultOptions,
	create: (context, options) => {
		return {
			MemberExpression: (node) => {
				if (!(node.object && node.object.type === 'Identifier'))
					return;
				if (!(node.property && node.property.type === 'Identifier'))
					return;

				if (options[0].properties.includes(node.property.name)) {
					let currentNode: any = node;
					const callPath = [];
					while (currentNode && currentNode.type === 'MemberExpression') {
						callPath.unshift((currentNode.property as any).name);
						currentNode = currentNode.object;
					}
					if (currentNode && currentNode.type === 'Identifier' && options[0].objects.includes(currentNode.name))
						context.report({ node, messageId: 'noOnlyTests', data: { callpath: callPath.join('.') }, fix: fixer => fixer.removeRange([node.range[0] - 1, node.range[1]]) });
				}
			},
		};
	},
});
