import { readFileSync } from 'node:fs';
import type { JSONSchema4 } from '@typescript-eslint/utils/json-schema';
import { createEslintRule } from '../utils';

type CommentSyntax = string | [string, string];
type DecorSyntax = string | [string, string, string];
type TemplatesSyntax = Record<string, [string, string]>;

export const RULE_NAME = 'file-header';
export type MessageIds = 'invalidHeader' | 'missingHeader' | 'headerSpacing';
export type Options = [{
	syntax?: CommentSyntax;
	decor?: DecorSyntax;
	templates?: TemplatesSyntax;
	newlines?: number;
	files?: string[];
	text?: string | string[];
	linebreak?: 'unix' | 'windows';
}];

// Adapted from https://codeberg.org/rini/eslint-plugin-simple-header

const validSyntax: JSONSchema4[] = [
	{
		type: 'object',
		properties: {
			syntax: { type: 'string' },
			decor: { type: 'string' },
		},
		additionalProperties: false,
	},
	{
		type: 'object',
		properties: {
			syntax: {
				type: 'array',
				items: { type: 'string' },
				minItems: 2,
				maxItems: 2,
			},
			decor: {
				type: 'array',
				items: { type: 'string' },
				minItems: 3,
				maxItems: 3,
			},
		},
		additionalProperties: false,
	},
];

const validSources: JSONSchema4[] = [
	{
		type: 'object',
		required: ['files'],
		properties: {
			files: {
				type: 'array',
				items: { type: 'string' },
				minItems: 1,
			},
		},
		additionalProperties: false,
	},
	{
		type: 'object',
		required: ['text'],
		properties: {
			text: {
				oneOf: [
					{ type: 'string' },
					{ type: 'array', items: { type: 'string' } },
				],
			},
		},
		additionalProperties: false,
	},
];

export default createEslintRule<Options, MessageIds>({
	name: RULE_NAME,
	meta: {
		type: 'layout',
		docs: {
			description: 'Enforce a file header across files.',
		},
		fixable: 'code',
		schema: [{
			type: 'object',
			additionalProperties: false,
			allOf: [{ anyOf: validSyntax }, { oneOf: validSources }],
			properties: {
				syntax: {
					type: ['string', 'array'],
					items: { type: 'string' },
					minItems: 2,
					maxItems: 2,
				},
				decor: {
					type: ['string', 'array'],
					items: { type: 'string' },
					minItems: 3,
					maxItems: 3,
				},
				files: {
					type: 'array',
					items: { type: 'string' },
					minItems: 1,
				},
				text: {
					oneOf: [
						{ type: 'string' },
						{ type: 'array', items: { type: 'string' } },
					],
				},
				templates: {
					type: 'object',
					additionalProperties: false,
					patternProperties: {
						'\\w+$': {
							type: 'array',
							items: { type: 'string' },
							minItems: 2,
							maxItems: 2,
						},
					},
				},
				newlines: { type: 'number', minimum: 0 },
				linebreak: { type: 'string', pattern: '^(unix|windows)$' },
			} satisfies Readonly<Record<keyof Options[0], JSONSchema4>>,
		}],
		messages: {
			headerSpacing: '',
			invalidHeader: '',
			missingHeader: '',
		},
	},
	defaultOptions: [{}],
	create: (context, [options]) => {
		const syntax = options.syntax ?? ['/*', '*/'];
		const decor = options.decor ?? (Array.isArray(syntax) ? ['\n', ' * ', '\n '] : ' ');
		const templates: TemplatesSyntax = { year: ['\\d{4}', `${new Date().getFullYear()}`], ...options.templates };
		const newlines = options.newlines ?? 1;
		const rawHeaders: string[] = options.files?.map(f => readFileSync(f, 'utf-8').trim())
			?? [Array.isArray(options.text) ? options.text.join('\n') : options.text!];
		const endline = options.linebreak
			? options.linebreak === 'windows' ? '\r\n' : '\n'
			: context.sourceCode.getText().includes('\r\n') ? '\r\n' : '\n';
		const offset = context.sourceCode.getText().match(/^#!.*\n/)?.[0]?.length ?? 0;
		const srcHeader = findHeader(context.sourceCode.getText().slice(offset), syntax);
		const headers = rawHeaders.map(raw => makeComment(raw, syntax, decor).replace(/\n/g, endline));
		const trailingLines = endline.repeat(context.sourceCode.getText().slice(srcHeader.length).trim() ? 1 + newlines : 1);

		if (!matchHeader(stripHeader(srcHeader.trim(), syntax), headers, templates))
			context.report({
				messageId: srcHeader.trim() ? 'invalidHeader' : 'missingHeader',
				loc: { line: 1, column: 0 },
				fix: f => f.replaceTextRange([offset, offset + srcHeader.length], makeHeader(headers, templates) + trailingLines),
			});
		else if (!srcHeader.startsWith(syntax[0]) || /\r?\n*$/.exec(srcHeader)?.[0] !== trailingLines)
			context.report({
				messageId: 'headerSpacing',
				loc: { line: 1, column: 0 },
				fix: f => f.replaceTextRange([offset, offset + srcHeader.length], srcHeader.trim() + trailingLines),
			});

		return {};
	},
});

const mapLines = (text: string, f: (line: string) => string): string => text.split('\n').map(f).join('\n');
const escapeRegex = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function isComment(text: string, syntax: CommentSyntax): boolean {
	return Array.isArray(syntax)
		? text.startsWith(syntax[0]) && text.endsWith(syntax[1])
		: text.split('\n').every(x => x.startsWith(syntax));
}

function makeComment(text: string, syntax: CommentSyntax, decor: DecorSyntax): string {
	if (isComment(text, syntax))
		return text;

	return Array.isArray(syntax)
		? syntax[0] + decor[0] + mapLines(text, x => (decor[1] + x).trimEnd()) + decor[2] + syntax[1]
		: mapLines(text, x => (syntax + decor + x).trimEnd());
}

function matchHeader(src: string, headers: string[], templates: TemplatesSyntax): boolean {
	for (const header of headers) {
		const body = escapeRegex(header)
			.replace(/\\\{(\w+)\\\}/g, (m, k) => templates[k]?.[0] ?? m);
		if (new RegExp(`^${body}$`).test(src))
			return true;
	}

	return false;
}

function makeHeader(headers: string[], templates: TemplatesSyntax): string {
	return headers[0].replace(/\{(\w+)\}/g, (m, k) => templates[k]?.[1] ?? m);
}

function stripHeader(header: string, syntax: CommentSyntax): string {
	if (Array.isArray(syntax)) {
		if (header.startsWith(`${syntax[0]}!`))
			return syntax[0] + header.slice(syntax[0].length + 1);

		return header;
	}

	return mapLines(header, x => x.startsWith(`${syntax}!`) ? syntax + x.slice(syntax.length + 1) : x);
}

function findHeader(src: string, syntax: CommentSyntax): string {
	const pat = Array.isArray(syntax)
		? String.raw`^\s*(${escapeRegex(syntax[0])}.*?${escapeRegex(syntax[1])}\s*)?`
		: String.raw`^\s*(${escapeRegex(syntax)}[^\n]*\n)*\s*`;

	const match = new RegExp(pat, 's').exec(src)?.[0] ?? '';
	if (match.startsWith('/**'))
		return '';

	return match;
}
