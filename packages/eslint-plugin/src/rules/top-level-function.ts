import { createEslintRule } from '../utils.ts';

export const RULE_NAME = 'top-level-function';
export type MessageIds = 'topLevelFunctionDeclaration';
export type Options = [];

export default createEslintRule<Options, MessageIds>({
	create: context => ({
		VariableDeclaration: (node) => {
			if (node.parent.type !== 'Program' && node.parent.type !== 'ExportNamedDeclaration')
				return;

			if (node.declarations.length !== 1)
				return;
			if (node.kind !== 'const')
				return;
			if (node.declare)
				return;

			const declaration = node.declarations[0];

			if (declaration.init?.type !== 'ArrowFunctionExpression' && declaration.init?.type !== 'FunctionExpression')
				return;
			if (declaration.id.type !== 'Identifier')
				return;
			if (declaration.id.typeAnnotation)
				return;
			if (
				declaration.init.body.type !== 'BlockStatement'
				&& declaration.id.loc.start.line === declaration.init.body.loc.end.line
			)
				return;

			const expression = declaration.init;
			const body = declaration.init.body;
			const id = declaration.id;

			context.report({
				fix: (f) => {
					const code = context.sourceCode.text;
					const textName = code.slice(id.range[0], id.range[1]);
					const textArgs = expression.params.length
						? code.slice(expression.params[0].range[0], expression.params[expression.params.length - 1].range[1])
						: '';
					const textBody = body.type === 'BlockStatement'
						? code.slice(body.range[0], body.range[1])
						: `{\n  return ${code.slice(body.range[0], body.range[1])}\n}`;
					const textGeneric = expression.typeParameters
						? code.slice(expression.typeParameters.range[0], expression.typeParameters.range[1])
						: '';
					const textTypeReturn = expression.returnType
						? code.slice(expression.returnType.range[0], expression.returnType.range[1])
						: '';
					const textAsync = expression.async ? 'async ' : '';

					const final = `${textAsync}function ${textName} ${textGeneric}(${textArgs})${textTypeReturn} ${textBody}`;
					return f.replaceTextRange([node.range[0], node.range[1]], final);
				},
				loc: {
					end: body.loc.start,
					start: id.loc.start,
				},
				messageId: 'topLevelFunctionDeclaration',
				node,
			});
		},
	}),
	defaultOptions: [],
	meta: {
		docs: {
			description: 'Enforce top-level functions to be declared with function keyword',
		},
		fixable: 'code',
		messages: {
			topLevelFunctionDeclaration: 'Top-level functions should be declared with function keyword',
		},
		schema: [],
		type: 'problem',
	},
	name: RULE_NAME,
});
