import type { TSESTree } from '@typescript-eslint/typescript-estree';
import { createEslintRule } from '../utils.js';

export const RULE_NAME = 'indent-binary-ops';
export type MessageIds = 'space';
export type Options = [{
	indent?: number | 'tab'
}];

export default createEslintRule<Options, MessageIds>({
	name: RULE_NAME,
	meta: {
		type: 'layout',
		docs: {
			description: 'Indentation for binary operators',
			recommended: 'stylistic',
		},
		fixable: 'whitespace',
		schema: [
			{
				type: 'object',
				properties: {
					warn: {
						type: 'boolean',
					},
					indent: {
						anyOf: [
							{
								type: 'integer',
								minimum: 0,
							},
							{
								type: 'string',
								enum: ['tab'],
							},
						],
					},
				},
				additionalProperties: false,
			},
		],
		messages: {
			space: 'Expect indentation to be consistent',
		},
	},
	defaultOptions: [{ indent: 2 }],
	create: (context, options) => {
		const { sourceCode } = context;

		const indentStr = options[0]?.indent === 'tab' ? '\t' : ' '.repeat(options[0]?.indent ?? 2);

		const indentCache = new Map<number, string>();
		function getIndentOfLine(line: number) {
			if (indentCache.has(line))
				return indentCache.get(line)!;
			return sourceCode.lines[line - 1].match(/^\s*/)?.[0] ?? '';
		}

		function firstTokenOfLine(line: number) {
			return sourceCode.tokensAndComments.find(token => token.loc.start.line === line);
		}

		function lastTokenOfLine(line: number) {
			return [...sourceCode.tokensAndComments].reverse().find(token => token.loc.end.line === line);
		}

		function handler(right: TSESTree.Node) {
			let tokenRight = sourceCode.getFirstToken(right)!;
			let tokenOperator = sourceCode.getTokenBefore(tokenRight)!;
			while (tokenOperator.value === '(') {
				tokenRight = tokenOperator;
				tokenOperator = sourceCode.getTokenBefore(tokenRight)!;
				if (tokenOperator.range[0] <= right.parent!.range[0])
					return;
			}
			const tokenLeft = sourceCode.getTokenBefore(tokenOperator)!;

			const isMultiline = tokenRight.loc.start.line !== tokenLeft.loc.start.line;
			if (!isMultiline)
				return;

			// If the first token of the line is a keyword (`if`, `return`, etc)
			const firstTokenOfLineLeft = firstTokenOfLine(tokenLeft.loc.start.line);
			const lastTokenOfLineLeft = lastTokenOfLine(tokenLeft.loc.start.line);
			const needAdditionIndent = firstTokenOfLineLeft?.type === 'Keyword'
				|| (firstTokenOfLineLeft?.type === 'Identifier' && firstTokenOfLineLeft.value === 'type')
				|| lastTokenOfLineLeft?.value === ':'
				|| lastTokenOfLineLeft?.value === '['
				|| lastTokenOfLineLeft?.value === '('
				|| lastTokenOfLineLeft?.value === '<';

			const indentTarget = getIndentOfLine(tokenLeft.loc.start.line) + (needAdditionIndent ? indentStr : '');
			const indentRight = getIndentOfLine(tokenRight.loc.start.line);
			if (indentTarget !== indentRight) {
				const start = {
					line: tokenRight.loc.start.line,
					column: 0,
				};
				const end = {
					line: tokenRight.loc.start.line,
					column: indentRight.length,
				};
				context.report({
					loc: {
						start,
						end,
					},
					messageId: 'space',
					fix(fixer) {
						return fixer.replaceTextRange(
							[sourceCode.getIndexFromLoc(start), sourceCode.getIndexFromLoc(end)],
							indentTarget,
						);
					},
				});
				indentCache.set(tokenRight.loc.start.line, indentTarget);
			}
		}

		return {
			BinaryExpression(node) {
				handler(node.right);
			},
			LogicalExpression(node) {
				handler(node.right);
			},
			TSUnionType(node) {
				if (node.type.length > 1) {
					node.types.forEach((type) => {
						handler(type);
					});
				}
			},
			TSIntersectionType(node) {
				if (node.type.length > 1) {
					node.types.forEach((type) => {
						handler(type);
					});
				}
			},
		};
	},
});
