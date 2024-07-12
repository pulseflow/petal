// import { JSONSchema4 } from '@typescript-eslint/utils/json-schema';
// import { createEslintRule } from '../utils';
// import { readFileSync } from 'fs';

// export const RULE_NAME = 'file-header';
// export type MessageIds = 'invalidHeader' | 'missingHeader' | 'headerSpacing';
// export type Options = [{
// 	syntax?: string | string[];
// 	decor?: string | string[];
// 	templates?: Record<string, string[]>;
// 	newlines?: number;
// 	files?: string[];
// 	text?: string | string[];
// 	linebreak?: 'unix' | 'windows';
// }];

// const defaultOptions: Options = [{
// 	syntax: ['/*', '*/'],
// 	newlines: 1,
// }];

// const validSyntax: JSONSchema4[] = [
// 	{
// 		type: 'object',
// 		properties: {
// 			syntax: {
// 				type: 'string'
// 			},
// 			decor: {
// 				type: 'string'
// 			},
// 		},
// 	},
// 	{
// 		type: 'object',
// 		properties: {
// 			syntax: {
// 				type: 'array',
// 				items: { type: 'string' },
// 				minItems: 2,
// 				maxItems: 2,
// 				default: defaultOptions[0].syntax,
// 			},
// 			decor: {
// 				type: 'array',
// 				items: { type: 'string' },
// 				minItems: 3,
// 				maxItems: 3,
// 			},
// 		},
// 	},
// ];

// const validSources: JSONSchema4[] = [
// 	{
// 		type: 'object',
// 		required: ['files'],
// 		properties: {
// 			files: {
// 				type: 'array',
// 				items: { type: 'string' },
// 				minItems: 1,
// 			},
// 		},
// 	},
// 	{
// 		type: 'object',
// 		required: ['text'],
// 		properties: {
// 			text: {
// 				oneOf: [
// 					{
// 						type: 'string',
// 					},
// 					{
// 						type: 'array',
// 						items: { type: 'string' },
// 					},
// 				],
// 			},
// 		},
// 	},
// ];

// export default createEslintRule<Options, MessageIds>({
// 	name: RULE_NAME,
// 	meta: {
// 		type: 'layout',
// 		docs: {
// 			description: 'Enforce a file header across files.'
// 		},
// 		fixable: 'code',
// 		schema: [{
// 			type: 'object',
// 			additionalProperties: false,
// 			allOf: [{
// 				anyOf: validSyntax,
// 				oneOf: validSources,
// 			}],
// 			properties: {
// 				syntax: {
// 					anyOf: validSyntax,
// 				},
// 				decor: {
// 					anyOf: validSyntax
// 				},
// 				files: {
// 					oneOf: validSources
// 				},
// 				text: {
// 					oneOf: validSources
// 				},
// 				templates: {
// 					type: 'object',
// 					additionalProperties: false,
// 					patternProperties: {
// 						'\\w+$': {
// 							type: 'array',
// 							items: { type: 'string' },
// 							minItems: 2, maxItems: 2,
// 						},
// 					},
// 				},
// 				newlines: {
// 					type: 'number',
// 					minimum: 0,
// 					default: defaultOptions[0].linebreak,
// 				},
// 				linebreak: {
// 					type: 'string',
// 					pattern: '^(unix|windows)$',
// 				}
// 			} satisfies Readonly<Record<keyof Options[0], JSONSchema4>>,
// 		}],
// 		messages: {
// 			headerSpacing: '',
// 			invalidHeader: '',
// 			missingHeader: ''
// 		}
// 	},
// 	defaultOptions,
// 	create: (context, [options = {}] = defaultOptions) => {
// 		const decor = options.decor ?? (Array.isArray(options.syntax) ? ['\n', ' * ', '\n '] : ' ');
// 		const templates: Record<string, string[]> = { year: ['\\d{4}', `${new Date().getFullYear()}`], ...options.templates };
// 		const rawHeaders = options.files?.map(f => readFileSync(f, 'utf-8').trim())
// 			?? [Array.isArray(options.text) ? options.text.join('\n') : options.text];
// 		const endline = options.linebreak
// 			? options.linebreak === 'windows' ? '\r\n' : '\n'
// 			: context.sourceCode.getText().includes('\r\n') ? '\r\n' : '\n';
// 		const offset = context.sourceCode.getText().match(/^#!.*?\n/)?.[0]?.length ?? 0;
// 		const srcHeader = findHeader(context.sourceCode.getText().slice(offset), options.syntax);
// 		const headers = rawHeaders.map(r => makeComment(r, options.syntax, decor).replace(/\n/g, endline));
// 		const trailingLines = endline.repeat(context.sourceCode.getText().slice(srcHeader.length).trim() ? 1 + options.newlines! : 1);

// 		if (!matchHeader(stripHeader(srcHeader.trim(), options.syntax), headers, templates))
// 			context.report({
// 				messageId: srcHeader.trim() ? 'invalidHeader' : 'missingHeader',
// 				loc: { line: 1, column: 0 },
// 				fix: f => f.replaceTextRange([offset, offset + srcHeader.length], makeHeader(headers, templates) + trailingLines),
// 			});
// 		else if (!srcHeader.startsWith(options.syntax![0]) || /(\r?\n)*$/.exec(srcHeader)[0] !== trailingLines)
// 			context.report({
// 				messageId: 'headerSpacing',
// 				loc: { line: 1, column: 0 },
// 				fix: f => f.replaceTextRange([offset, offset + srcHeader.length], srcHeader.trim() + trailingLines),
// 			});

// 		return {};
// 	}
// });
