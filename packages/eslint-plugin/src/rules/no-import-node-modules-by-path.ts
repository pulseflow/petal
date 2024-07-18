import type { TSESTree } from '@typescript-eslint/utils';
import { createEslintRule } from '../utils';

export const RULE_NAME = 'no-import-node-modules-by-path';
export type MessageIds = 'noImportNodeModulesByPath';
export type Options = [];

export default createEslintRule<Options, MessageIds>({
	name: RULE_NAME,
	meta: {
		type: 'problem',
		docs: {
			description: 'Prevent importing modules in `node_modules` folder by relative or absolute path',
		},
		schema: [],
		messages: {
			noImportNodeModulesByPath: 'Do not import modules in `node_modules` folder by path',
		},
	},
	defaultOptions: [],
	create: context => ({
		'ImportDeclaration': (node) => {
			if (node.source.value.includes('/node_modules/'))
				context.report({ node, messageId: 'noImportNodeModulesByPath' });
		},
		'CallExpression[callee.name="require"]': (node: TSESTree.CallExpression) => {
			const arg = 'value' in node.arguments[0] ? node.arguments[0].value : null;
			const value = arg ? typeof arg === 'string' ? arg : null : null;
			if (value && value.includes('/node_modules/'))
				context.report({ node, messageId: 'noImportNodeModulesByPath' });
		},
	}),
});
