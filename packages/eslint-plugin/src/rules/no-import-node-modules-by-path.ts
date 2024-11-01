import type { TSESTree } from '@typescript-eslint/utils';
import { createEslintRule } from '../utils.ts';

export const RULE_NAME = 'no-import-node-modules-by-path';
export type MessageIds = 'noImportNodeModulesByPath';
export type Options = [];

export default createEslintRule<Options, MessageIds>({
	create: context => ({
		'CallExpression[callee.name="require"]': (node: TSESTree.CallExpression) => {
			const arg = 'value' in node.arguments[0] ? node.arguments[0].value : null;
			const value = arg ? typeof arg === 'string' ? arg : null : null;
			if (value && value.includes('/node_modules/'))
				context.report({ messageId: 'noImportNodeModulesByPath', node });
		},
		'ImportDeclaration': (node) => {
			if (node.source.value.includes('/node_modules/'))
				context.report({ messageId: 'noImportNodeModulesByPath', node });
		},
	}),
	defaultOptions: [],
	meta: {
		docs: {
			description: 'Prevent importing modules in `node_modules` folder by relative or absolute path',
		},
		messages: {
			noImportNodeModulesByPath: 'Do not import modules in `node_modules` folder by path',
		},
		schema: [],
		type: 'problem',
	},
	name: RULE_NAME,
});
