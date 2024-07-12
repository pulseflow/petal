import type { TSESTree } from '@typescript-eslint/utils';
import type { JSONSchema4 } from '@typescript-eslint/utils/json-schema';
import { createEslintRule } from '../utils';

export const RULE_NAME = 'only-export-components';
export type MessageIds = 'exportAll' | 'namedExport' | 'anonymousExport' | 'localComponents' | 'noExport';
export type Options = [{
	allowConstantExport?: boolean;
	checkJS?: boolean;
	allowExportNames?: string[];
}];

const possibleRegex = /^[A-Z][a-zA-Z0-9]*$/u;
const strictRegex = /^[A-Z][\dA-Z]*[a-z][\dA-Za-z]*$/u;
type ToString<T> = T extends `${infer V}` ? V : never;
const notReactComponentExpression: ToString<TSESTree.Expression['type']>[] = [
	'ArrayExpression',
	'AwaitExpression',
	'BinaryExpression',
	'ChainExpression',
	'ConditionalExpression',
	'Literal',
	'LogicalExpression',
	'ObjectExpression',
	'TemplateLiteral',
	'ThisExpression',
	'UnaryExpression',
	'UpdateExpression',
];

// Adapted from https://github.com/ArnaudBarre/eslint-plugin-react-refresh

export default createEslintRule<Options, MessageIds>({
	name: RULE_NAME,
	meta: {
		type: 'problem',
		docs: {
			description: 'Validates that React components can be safely updated with fast refresh',
		},
		schema: [{
			type: 'object',
			properties: {
				allowConstantExport: { type: 'boolean' },
				checkJS: { type: 'boolean' },
				allowExportNames: { type: 'array', items: { type: 'string' } },
			} satisfies Readonly<Record<keyof Options[0], JSONSchema4>>,
			additionalProperties: false,
		}],
		messages: {
			exportAll: 'This rule is unable to verify that `export *` only exports components.',
			namedExport: 'Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components.',
			anonymousExport: 'Fast refresh is unable to handle anonymous components. Add a name to this export.',
			localComponents: 'Fast refresh only works when a file only exports components. Move your component(s) to a seperate file.',
			noExport: 'Fast refresh only works when a file has exports. Move your component(s) to a seperate file.',
		},
	},
	defaultOptions: [{}],
	create: (context, [options = {}] = [{}]) => {
		if (['.test.', '.spec.', '.cy.', '.stories.'].some(f => context.filename.includes(f)))
			return {};

		if (!(['.jsx', '.tsx'].some(f => context.filename.includes(f)) || (options.checkJS && context.filename.endsWith('.js'))))
			return {};

		return {
			Program: (program) => {
				const ruleContext = {
					hasExports: false,
					mayHaveReactExport: false,
					reactIsInScope: false,
				};
				const localComponents: TSESTree.Identifier[] = [];
				const nonComponentExports: TSESTree.BindingName[] = [];

				const handleLocalIdentifier = (id: TSESTree.BindingName) => {
					if (id.type !== 'Identifier')
						return;
					if (possibleRegex.test(id.name))
						localComponents.push(id);
				};

				const handleExportIdentifier = (
					id: TSESTree.BindingName,
					isFn?: boolean,
					init?: TSESTree.Expression | null,
				) => {
					if (id.type !== 'Identifier') {
						nonComponentExports.push(id);
						return;
					}

					if (options.allowExportNames?.includes(id.name))
						return;

					if (options.allowConstantExport && init && ['Literal', 'TemplateLiteral', 'BinaryExpression'].includes(init.type))
						return;

					if (isFn) {
						if (possibleRegex.test(id.name))
							ruleContext.mayHaveReactExport = true;
						else nonComponentExports.push(id);
					}
					else {
						if (init && notReactComponentExpression.includes(init.type)) {
							nonComponentExports.push(id);
							return;
						}

						if (!ruleContext.mayHaveReactExport && possibleRegex.test(id.name))
							ruleContext.mayHaveReactExport = true;

						if (!strictRegex.test(id.name))
							nonComponentExports.push(id);
					}
				};

				const handleExportDeclaration = (node: TSESTree.ExportDeclaration) => {
					if (node.type === 'VariableDeclaration')
						for (const val of node.declarations)
							handleExportIdentifier(val.id, canBeReactFunctionComponent(val.init), val.init);
					else if (node.type === 'FunctionDeclaration')
						if (node.id === null)
							context.report({ messageId: 'anonymousExport', node });
						else handleExportIdentifier(node.id, true);
					else if (node.type === 'CallExpression')
						if (
							node.callee.type === 'Identifier'
							&& ['memo', 'forwardRef'].includes(node.callee.name)
							&& node.arguments[0]?.type === 'FunctionExpression'
							&& node.arguments[0].id
						) handleExportIdentifier(node.arguments[0].id, true);
						else context.report({ messageId: 'anonymousExport', node });
					else if (node.type === 'TSEnumDeclaration')
						nonComponentExports.push(node.id);
				};

				for (const node of program.body)
					if (node.type === 'ExportAllDeclaration') {
						if (node.exportKind === 'type')
							continue;
						ruleContext.hasExports = true;
						context.report({ messageId: 'exportAll', node });
					}
					else if (node.type === 'ExportDefaultDeclaration') {
						ruleContext.hasExports = true;
						if (
							node.declaration.type === 'VariableDeclaration'
							|| node.declaration.type === 'FunctionDeclaration'
							|| node.declaration.type === 'CallExpression'
						)
							handleExportDeclaration(node.declaration);

						if (node.declaration.type === 'Identifier')
							handleExportIdentifier(node.declaration);

						if (node.declaration.type === 'ArrowFunctionExpression')
							context.report({ messageId: 'anonymousExport', node });
					}
					else if (node.type === 'ExportNamedDeclaration') {
						ruleContext.hasExports = true;
						if (node.declaration)
							handleExportDeclaration(node.declaration);
						for (const spec of node.specifiers)
							handleExportIdentifier(spec.exported.name === 'default' ? spec.local : spec.exported);
					}
					else if (node.type === 'VariableDeclaration') {
						for (const variable of node.declarations) handleLocalIdentifier(variable.id);
					}
					else if (node.type === 'FunctionDeclaration') {
						handleLocalIdentifier(node.id);
					}
					else if (node.type === 'ImportDeclaration' && node.source.value === 'react') {
						ruleContext.reactIsInScope = true;
					}

				if (options.checkJS && !ruleContext.reactIsInScope)
					return;

				if (ruleContext.hasExports) {
					if (ruleContext.mayHaveReactExport)
						for (const node of nonComponentExports)
							context.report({ messageId: 'namedExport', node });

					else if (localComponents.length)
						for (const node of localComponents)
							context.report({ messageId: 'localComponents', node });
				}
				else if (localComponents.length) {
					for (const node of localComponents)
						context.report({ messageId: 'noExport', node });
				}
			},
		};
	},
});

function canBeReactFunctionComponent(init: TSESTree.Expression | null): boolean {
	if (!init)
		return false;
	if (init.type === 'ArrowFunctionExpression')
		return true;
	if (init.type === 'CallExpression' && init.callee.type === 'Identifier')
		return ['memo', 'forwardRef'].includes(init.callee.name);

	return false;
}
