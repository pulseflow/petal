import { createEslintRule } from '../utils';

export const RULE_NAME = 'no-import-dist';
export type MessageIds = 'noImportDist';
export type Options = [];

const isDist = (path: string): boolean => Boolean((path.startsWith('.') && path.match(/\/dist(\/|$)/))) || path === 'dist';

export default createEslintRule<Options, MessageIds>({
	name: RULE_NAME,
	meta: {
		type: 'problem',
		docs: {
			description: 'Prevent importing modules in `dist` folder',
		},
		schema: [],
		messages: {
			noImportDist: 'Do not import modules in `dist` folder, got {{path}}',
		},
	},
	defaultOptions: [],
	create: context => ({
		ImportDeclaration: (node) => {
			if (isDist(node.source.value))
				context.report({
					node,
					messageId: 'noImportDist',
					data: {
						path: node.source.value,
					},
				});
		},
	}),
});
