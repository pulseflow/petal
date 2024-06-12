import { createEslintRule } from '../utils';

export const RULE_NAME = 'no-import-dist';
export type MessageIds = 'noImportDist';
export type Options = [];

export default createEslintRule<Options, MessageIds>({
	name: RULE_NAME,
	meta: {
		type: 'problem',
		docs: {
			description: 'Prevent importing modules in `dist` folder',
			recommended: 'recommended',
		},
		schema: [],
		messages: {
			noImportDist: 'Do not import modules in `dist` folder, got {{path}}',
		},
	},
	defaultOptions: [],
	create: (context) => {
		const isDist = (path: string) => (path.startsWith('.') && path.match(/\/dist(\/|$)/)) || path === 'dist';

		return {
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
		};
	},
});
