import { createEslintRule } from '../utils.ts';

export const RULE_NAME = 'no-import-dist';
export type MessageIds = 'noImportDist';
export type Options = [];

const isDist = (path: string): boolean => Boolean((path.startsWith('.') && path.match(/\/dist(\/|$)/))) || path === 'dist';

export default createEslintRule<Options, MessageIds>({
	create: context => ({
		ImportDeclaration: (node) => {
			if (isDist(node.source.value))
				context.report({
					data: {
						path: node.source.value,
					},
					messageId: 'noImportDist',
					node,
				});
		},
	}),
	defaultOptions: [],
	meta: {
		docs: {
			description: 'Prevent importing modules in `dist` folder',
		},
		messages: {
			noImportDist: 'Do not import modules in `dist` folder, got {{path}}',
		},
		schema: [],
		type: 'problem',
	},
	name: RULE_NAME,
});
