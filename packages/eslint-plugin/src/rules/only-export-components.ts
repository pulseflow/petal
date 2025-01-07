import type { TSESTree } from '@typescript-eslint/utils';
import type { JSONSchema4 } from '@typescript-eslint/utils/json-schema';
import { createEslintRule } from '../utils.ts';

export const RULE_NAME = 'only-export-components';
export type MessageIds =
	| 'exportAll'
	| 'namedExport'
	| 'anonymousExport'
	| 'localComponents'
	| 'noExport'
	| 'noAMI'
	| 'reactContext';
export type Options = [{
	allowConstantExport?: boolean;
	checkJS?: boolean;
	allowExportNames?: string[];
	customHOCs?: string[];
}];

const defaultOptions: Options = [{
	allowConstantExport: false,
	checkJS: false,
	allowExportNames: [],
	customHOCs: [],
}];
const reactComponentNameRE = /^[A-Z][a-zA-Z0-9]*$/u;
type ToString<Type> = Type extends `${infer String}` ? String : never;
const notReactComponentExpression: Set<ToString<TSESTree.Expression['type']>> = new Set([
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
]);

// Adapted from https://github.com/ArnaudBarre/eslint-plugin-react-refresh

export default createEslintRule<Options, MessageIds>({
	create: (context, [options = {}] = defaultOptions) => {
		if (['.test.', '.spec.', '.cy.', '.stories.'].some(f => context.filename.includes(f)))
			return {};

		if (!(['.jsx', '.tsx'].some(f => context.filename.includes(f)) || (options.checkJS && context.filename.endsWith('.js'))))
			return {};

		return {
			Program: (program) => {
				const ruleContext = { hasExports: false, hasReactExport: false, reactIsInScope: false };
				const localComponents: TSESTree.Identifier[] = [];
				const nonComponentExports: Array<TSESTree.BindingName | TSESTree.StringLiteral> = [];
				const allowExportNames = new Set(options.allowExportNames);
				const reactHOCs = new Set(['forwardRef', 'memo', ...options.customHOCs!]);
				const reactContextExports: TSESTree.Identifier[] = [];

				const canBeReactFunctionComponent = (init: TSESTree.VariableDeclaratorMaybeInit['init']): boolean => {
					if (!init)
						return false;

					if (init.type === 'ArrowFunctionExpression')
						return true;

					if (init.type === 'CallExpression' && init.callee.type === 'Identifier')
						return reactHOCs.has(init.callee.name);

					return false;
				};

				const handleLocalIdentifier = (id: TSESTree.BindingName): void => {
					if (id.type !== 'Identifier')
						return;
					if (reactComponentNameRE.test(id.name))
						localComponents.push(id);
				};

				const handleExportIdentifier = (id: TSESTree.BindingName | TSESTree.StringLiteral, isFn?: boolean, init?: TSESTree.Expression | null): void => {
					if (id.type !== 'Identifier') {
						nonComponentExports.push(id);
						return;
					}

					if (allowExportNames.has(id.name))
						return;

					// Literal: 1, 'foo', UnaryExpression: -1, TemplateLiteral: `Some ${template}`, BinaryExpression: 24 * 60.
					if (options.allowConstantExport && init && ['BinaryExpression', 'Literal', 'TemplateLiteral', 'UnaryExpression'].includes(init.type))
						return;

					if (isFn) {
						if (reactComponentNameRE.test(id.name))
							ruleContext.hasReactExport = true;
						else nonComponentExports.push(id);
					}
					else {
						if (
							init && init.type === 'CallExpression'
							&& ((init.callee.type === 'Identifier'
								&& init.callee.name === 'createContext')
							|| (init.callee.type === 'MemberExpression'
								&& init.callee.property.type === 'Identifier'
								&& init.callee.property.name === 'createContext'))
						) {
							reactContextExports.push(id);
							return;
						}
						if (init && notReactComponentExpression.has(init.type)) {
							nonComponentExports.push(id);
							return;
						}
						if (reactComponentNameRE.test(id.name))
							ruleContext.hasReactExport = true;
						else
							nonComponentExports.push(id);
					}
				};

				const handleExportDeclaration = (node: TSESTree.ExportDeclaration): void => {
					if (node.type === 'VariableDeclaration')
						node.declarations.forEach(v => handleExportIdentifier(v.id, canBeReactFunctionComponent(v.init), v.init));
					else if (node.type === 'FunctionDeclaration')
						if (node.id === null)
							context.report({ messageId: 'anonymousExport', node });
						else handleExportIdentifier(node.id, true);
					else if (node.type === 'CallExpression')
						if (node.callee.type === 'CallExpression' && node.callee.callee.type === 'Identifier' && node.callee.callee.name === 'connect')
							ruleContext.hasReactExport = true;
						else if (node.callee.type !== 'Identifier')
							if (node.callee.type === 'MemberExpression' && node.callee.property.type === 'Identifier' && reactHOCs.has(node.callee.property.name))
								ruleContext.hasReactExport = true;
							else context.report({ messageId: 'anonymousExport', node });
						else if (!reactHOCs.has(node.callee.name))
							context.report({ messageId: 'anonymousExport', node });
						else if (node.arguments[0].type === 'FunctionExpression' && node.arguments[0].id)
							handleExportIdentifier(node.arguments[0].id, true);
						else if (node.arguments[0]?.type === 'Identifier')
							ruleContext.hasReactExport = true;
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
						const declaration = node.declaration.type === 'TSAsExpression'
							|| node.declaration.type === 'TSSatisfiesExpression'
							? node.declaration.expression
							: node.declaration;
						if (
							declaration.type === 'VariableDeclaration'
							|| declaration.type === 'FunctionDeclaration'
							|| declaration.type === 'CallExpression'
						)
							handleExportDeclaration(declaration);

						if (declaration.type === 'Identifier')
							handleExportIdentifier(declaration);

						if (declaration.type === 'ArrowFunctionExpression')
							context.report({ messageId: 'anonymousExport', node });
					}
					else if (node.type === 'ExportNamedDeclaration') {
						if (node.exportKind === 'type')
							continue;
						ruleContext.hasExports = true;
						if (node.declaration)
							handleExportDeclaration(node.declaration);
						node.specifiers.forEach(i => handleExportDeclaration(i.exported.type === 'Identifier' && i.exported.name === 'default' ? i.local : i.exported));
					}
					else if (node.type === 'VariableDeclaration') {
						node.declarations.forEach(v => handleLocalIdentifier(v.id));
					}
					else if (node.type === 'FunctionDeclaration') {
						handleLocalIdentifier(node.id);
					}
					else if (node.type === 'ImportDeclaration' && node.source.value === 'react') {
						ruleContext.reactIsInScope = true;
					}

				if (options.checkJS && !ruleContext.reactIsInScope)
					return;

				if (ruleContext.hasExports)
					if (ruleContext.hasReactExport) {
						nonComponentExports.forEach(node => context.report({ messageId: 'namedExport', node }));
						reactContextExports.forEach(node => context.report({ messageId: 'reactContext', node }));
					}
					else if (localComponents.length) {
						localComponents.forEach(node => context.report({ messageId: 'localComponents', node }));
					}
					else if (localComponents.length) {
						localComponents.forEach(node => context.report({ messageId: 'noExport', node }));
					}
			},
		};
	},
	defaultOptions,
	meta: {
		docs: {
			description: 'Validates that React components can be safely updated with fast refresh',
		},
		messages: {
			anonymousExport: 'Fast refresh is unable to handle anonymous components. Add a name to this export.',
			exportAll: 'This rule is unable to verify that `export *` only exports components.',
			localComponents: 'Fast refresh only works when a file only exports components. Move your component(s) to a seperate file.',
			namedExport: 'Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components.',
			noAMI: 'Fast refrsh only works when a file uses standard imports, not arbitrary modules.',
			noExport: 'Fast refresh only works when a file has exports. Move your component(s) to a seperate file.',
			reactContext: 'Fast refresh only works when a file only exports components. Move your React context(s) to a seperate file.',
		},
		schema: [{
			additionalProperties: false,
			properties: {
				allowConstantExport: { type: 'boolean' },
				allowExportNames: { items: { type: 'string' }, type: 'array' },
				checkJS: { type: 'boolean' },
				customHOCs: { type: 'array', items: { type: 'string' } },
			} satisfies Readonly<Record<keyof Options[0], JSONSchema4>>,
			type: 'object',
		}],
		type: 'problem',
	},
	name: RULE_NAME,
});
