import type { TSESTree } from '@typescript-eslint/utils';
import type { JSONSchema4 } from '@typescript-eslint/utils/json-schema';
import { createEslintRule } from '../utils';

export const RULE_NAME = 'no-only-tests';
export type MessageIds = 'noOnlyTests' | 'noOnlyFunction';
export type Options = [{
	blocks?: string[];
	focus?: string[];
	functions?: string[];
}];

function getCallPath(node: TSESTree.Node, path: string[] = []): string[] {
	if (node.type === 'Identifier')
		return [node.name, ...path];
	if (node.type === 'MemberExpression' && node.object)
		return getCallPath(node.object, [(node.property as TSESTree.Identifier).name, ...path]);
	if (node.type === 'CallExpression' && node.callee)
		return getCallPath(node.callee, path);

	return path;
}

const defaultOptions: Options = [{
	/// @keep-sorted
	blocks: [
		'describe',
		'it',
		'context',
		'test',
		'tape',
		'fixture',
		'serial',
		'Feature',
		'Scenario',
		'Given',
		'And',
		'When',
		'Then',
	],
	focus: ['only'],
	functions: [],
}];

// Adapted from https://github.com/levibuzolic/eslint-plugin-no-only-tests

export default createEslintRule<Options, MessageIds>({
	name: RULE_NAME,
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Disallows .only blocks in testing',
		},
		fixable: 'code',
		schema: [{
			type: 'object',
			properties: {
				blocks: {
					type: 'array',
					items: {
						type: 'string',
					},
					uniqueItems: true,
					default: defaultOptions[0].blocks,
				},
				focus: {
					type: 'array',
					items: {
						type: 'string',
					},
					uniqueItems: true,
					default: defaultOptions[0].focus,
				},
				functions: {
					type: 'array',
					items: {
						type: 'string',
					},
					uniqueItems: true,
					default: defaultOptions[0].functions,
				},
			} satisfies Readonly<Record<keyof Options[0], JSONSchema4>>,
			additionalProperties: false,
		}],
		messages: {
			noOnlyTests: 'Should not use .only blocks in tests at {{callPath}}',
			noOnlyFunction: 'Should not use function {{name}} in tests.',
		},
	},
	defaultOptions,
	create: (context, [options = {}] = defaultOptions) => {
		const blocks = options.blocks || defaultOptions[0].blocks || [];
		const focus = options.focus || defaultOptions[0].focus || [];
		const functions = options.functions || defaultOptions[0].functions || [];

		return {
			Identifier: (node) => {
				if (functions.length && functions.includes(node.name))
					context.report({ node, data: { name: node.name }, messageId: 'noOnlyFunction' });

				const parentObject = 'object' in node.parent ? node.parent.object : undefined;
				if (parentObject == null)
					return;
				if (!focus.includes(node.name))
					return;
				const callPath = getCallPath(node.parent).join('.');

				if (blocks.find((block) => {
					if (block.endsWith('*'))
						return callPath.startsWith(block.replace(/\*$/, ''));
					return callPath.startsWith(`${block}.`);
				}))
					context.report({ node, messageId: 'noOnlyTests', fix: f => f.removeRange([node.range[0] - 1, node.range[1]]) });
			},
		};
	},
});
