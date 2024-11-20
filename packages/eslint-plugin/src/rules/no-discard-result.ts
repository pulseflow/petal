import type { ParserServicesWithTypeInformation, TSESTree } from '@typescript-eslint/utils';
import { ESLintUtils } from '@typescript-eslint/utils';
import ts from 'typescript';
import { createEslintRule } from '../utils.ts';

export const RULE_NAME = 'no-discard-result';
export type MessageIds = 'discardedResult';
export type Options = [];

const resultPath = require.resolve('@flowr/result').split('/').slice(0, -1).concat('index.d.ts').join('/');
const isUnionType = (type: ts.Type): type is ts.UnionType => (type.flags & ts.TypeFlags.Union) !== 0;
const unionTypeParts = (type: ts.Type): ts.Type[] => isUnionType(type) ? type.types : [type];

function isCallback(checker: ts.TypeChecker, param: ts.Symbol, node: ts.Node): boolean {
	let type: ts.Type | undefined = checker.getApparentType(checker.getTypeOfSymbolAtLocation(param, node));

	if ((param.valueDeclaration as ts.ParameterDeclaration).dotDotDotToken) {
		type = type.getNumberIndexType();
		if (type === undefined)
			return false;
	}

	for (const t of unionTypeParts(type))
		if (t.getCallSignatures().length !== 0)
			return true;

	return false;
}

function isThenableType(checker: ts.TypeChecker, node: ts.Node, type: ts.Type): boolean;
function isThenableType(checker: ts.TypeChecker, node: ts.Expression, type?: ts.Type): boolean;
function isThenableType(checker: ts.TypeChecker, node: ts.Node, type = checker.getTypeAtLocation(node)): boolean {
	for (const t of unionTypeParts(checker.getApparentType(type))) {
		const then = t.getProperty('then');

		if (then === undefined)
			continue;

		const thenType = checker.getTypeOfSymbolAtLocation(then, node);
		for (const t of unionTypeParts(thenType))
			for (const signature of t.getCallSignatures())
				if (signature.parameters.length !== 0 && isCallback(checker, signature.parameters[0], node))
					return true;
	}

	return false;
}

function getResultType(service: ParserServicesWithTypeInformation, checker: ts.TypeChecker): ts.Type | null {
	const file = service.program.getSourceFile(resultPath);
	const resultNode = file?.statements.find(node => ts.isTypeAliasDeclaration(node) && node.name.getText() === 'Result');

	if (resultNode)
		return checker.getTypeAtLocation(resultNode);

	return null;
}

function unwrapPotentialPromise(checker: ts.TypeChecker, node: ts.CallExpression, type = checker.getTypeAtLocation(node)): ts.Type {
	if (isUnionType(type)) {
		const { ...copy } = type; // avoids mutation
		copy.types = type.types.filter(s => Boolean(s)); // filters out nullish values
		if (copy.types.length === 1)
			return unwrapPotentialPromise(checker, node, copy.types[0]);

		copy.types = copy.types.map(s => unwrapPotentialPromise(checker, node, s));
		return copy;
	}

	if (isThenableType(checker, node))
		return checker.getTypeArguments(type as ts.TypeReference)[0];

	return type;
}

function hasResultLikeReturnType(
	service: ParserServicesWithTypeInformation,
	node: TSESTree.CallExpression,
): boolean {
	const checker = service.program.getTypeChecker();
	const nodeMap = service.esTreeNodeToTSNodeMap.get(node);
	const functionDeclaration = checker.getResolvedSignature(nodeMap);

	if (!functionDeclaration)
		return false;

	const returnType = unwrapPotentialPromise(checker, nodeMap);
	const resultType = getResultType(service, checker);

	if (!returnType.aliasSymbol || !resultType?.aliasSymbol)
		return false;

	// hacky bit of reflection logic until type relationship api https://github.com/microsoft/TypeScript/issues/9879
	return Reflect.get(returnType.aliasSymbol, 'id') === Reflect.get(resultType.aliasSymbol, 'id');
}

function isDiscardedResult(node: TSESTree.Node): boolean {
	// checks for `void foo();` is explicit and allowed
	if (node.parent?.type === 'UnaryExpression' && node.parent.operator === 'void')
		return false;

	// checks for variable declaration, assignment, `foo(functionReturningResult());` (automatically false).
	if (node.parent && ['AssignmentExpression', 'CallExpression', 'VariableDeclarator'].includes(node.parent.type))
		return false;

	// checks for sequences like `(void 0, x())`, awaits, tenary conditionals, and operators (recursively).
	if (node.parent && ['AwaitExpression', 'ConditionalExpression', 'LogicalExpression', 'SequenceExpression'].includes(node.parent.type))
		return isDiscardedResult(node.parent);

	return true;
}

export default createEslintRule<Options, MessageIds>({
	create: context => ({
		CallExpression: (node) => {
			if (hasResultLikeReturnType(ESLintUtils.getParserServices(context), node))
				if (isDiscardedResult(node))
					context.report({ messageId: 'discardedResult', node });
		},
	}),
	defaultOptions: [],
	meta: {
		docs: {
			description: 'Disallow discarding the result of a function returning a Result.',
		},
		messages: {
			discardedResult: 'This function returns a Result, but its return value is being discarded.',
		},
		schema: [],
		type: 'problem',
	},
	name: RULE_NAME,
});
