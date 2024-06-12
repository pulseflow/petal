import type { JSONSchema4 } from '@typescript-eslint/utils/json-schema';
import type { TSESTree } from '@typescript-eslint/utils';
import { createEslintRule } from '../utils';

export const RULE_NAME = 'no-only-tests';
export type MessageIds = 'noOnlyTests';
export type Options = [{
	blocks?: string[];
	focus?: string[];
}];

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
}];

// Adapted from https://github.com/levibuzolic/eslint-plugin-no-only-tests

export default createEslintRule<Options, MessageIds>({
	name: RULE_NAME,
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Disallows .only blocks in testing',
			recommended: 'stylistic',
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
			} satisfies Record<keyof Options[0], JSONSchema4>,
			additionalProperties: false,
		}],
		messages: {
			noOnlyTests: 'Should not use .only blocks in tests at {{callPath}}',
		},
	},
	defaultOptions,
	create: (context, [options = {}] = defaultOptions) => {
		const blocks = options.blocks || defaultOptions[0].blocks || [];
		const focus = options.focus || defaultOptions[0].focus || [];

		function getCallPath(node: TSESTree.Node, path: string[] = []): string[] {
			if (node.type === 'Identifier')
				return [node.name, ...path];
			if (node.type === 'MemberExpression' && node.object)
				return getCallPath(node.object, [(node.property as TSESTree.Identifier).name, ...path]);
			if (node.type === 'CallExpression' && node.callee)
				return getCallPath(node.callee, path);

			return path;
		}

		return {
			Identifier: (node) => {
				const parentObject = node.parent && (node.parent as TSESTree.MemberExpression).object;
				if (!parentObject)
					return;
				if (!focus.includes(node.name))
					return;
				const callPath = getCallPath(node.parent).join('.');

				if (blocks.some(f => (f.endsWith('*')) ? callPath.startsWith(f.replace(/\*$/, '')) : callPath.startsWith(`${f}.`)))
					context.report({ node, messageId: 'noOnlyTests', fix: fx => fx.removeRange([node.range[0] - 1, node.range[1]]) });
			},
		};
	},
});
