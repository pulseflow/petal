import type { JSONSchema4 } from '@typescript-eslint/utils/json-schema';
import { readFileSync } from 'node:fs';
import { createEslintRule } from '../utils.ts';

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

const defaultOptions: Options = [{}];

// Adapted from https://codeberg.org/rini/eslint-plugin-simple-header

const validSyntax: JSONSchema4[] = [
	{
		additionalProperties: false,
		properties: {
			decor: { type: 'string' },
			syntax: { type: 'string' },
		},
		type: 'object',
	},
	{
		additionalProperties: false,
		properties: {
			decor: {
				items: { type: 'string' },
				maxItems: 3,
				minItems: 3,
				type: 'array',
			},
			syntax: {
				items: { type: 'string' },
				maxItems: 2,
				minItems: 2,
				type: 'array',
			},
		},
		type: 'object',
	},
];

const validSources: JSONSchema4[] = [
	{
		additionalProperties: false,
		properties: {
			files: {
				items: { type: 'string' },
				minItems: 1,
				type: 'array',
			},
		},
		required: ['files'],
		type: 'object',
	},
	{
		additionalProperties: false,
		properties: {
			text: {
				oneOf: [
					{ type: 'string' },
					{ items: { type: 'string' }, type: 'array' },
				],
			},
		},
		required: ['text'],
		type: 'object',
	},
];

export default createEslintRule<Options, MessageIds>({
	create: (context, [options = {}] = defaultOptions) => {
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
				fix: f => f.replaceTextRange([offset, offset + srcHeader.length], makeHeader(headers, templates) + trailingLines),
				loc: { column: 0, line: 1 },
				messageId: srcHeader.trim() ? 'invalidHeader' : 'missingHeader',
			});
		else if (!srcHeader.startsWith(syntax[0]) || /\r?\n*$/.exec(srcHeader)?.[0] !== trailingLines)
			context.report({
				fix: f => f.replaceTextRange([offset, offset + srcHeader.length], srcHeader.trim() + trailingLines),
				loc: { column: 0, line: 1 },
				messageId: 'headerSpacing',
			});

		return {};
	},
	defaultOptions,
	meta: {
		docs: {
			description: 'Enforce a file header across files.',
		},
		fixable: 'code',
		messages: {
			headerSpacing: '',
			invalidHeader: '',
			missingHeader: '',
		},
		schema: [{
			additionalProperties: false,
			allOf: [{ anyOf: validSyntax }, { oneOf: validSources }],
			properties: {
				decor: {
					items: { type: 'string' },
					maxItems: 3,
					minItems: 3,
					type: ['string', 'array'],
				},
				files: {
					items: { type: 'string' },
					minItems: 1,
					type: 'array',
				},
				linebreak: { pattern: '^(unix|windows)$', type: 'string' },
				newlines: { minimum: 0, type: 'number' },
				syntax: {
					items: { type: 'string' },
					maxItems: 2,
					minItems: 2,
					type: ['string', 'array'],
				},
				templates: {
					additionalProperties: false,
					patternProperties: {
						'\\w+$': {
							items: { type: 'string' },
							maxItems: 2,
							minItems: 2,
							type: 'array',
						},
					},
					type: 'object',
				},
				text: {
					oneOf: [
						{ type: 'string' },
						{ items: { type: 'string' }, type: 'array' },
					],
				},
			} satisfies Readonly<Record<keyof Options[0], JSONSchema4>>,
			type: 'object',
		}],
		type: 'layout',
	},
	name: RULE_NAME,
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
		: mapLines(text, x => (syntax + decor.toString() + x).trimEnd());
}

function matchHeader(src: string, headers: string[], templates: TemplatesSyntax): boolean {
	for (const header of headers) {
		// eslint-disable-next-line ts/no-unnecessary-condition -- weak types
		const body = escapeRegex(header).replace(/\\\{(\w+)\\\}/g, (m, k) => templates[k]?.[0] ?? m);
		if (new RegExp(`^${body}$`).test(src))
			return true;
	}

	return false;
}

function makeHeader(headers: string[], templates: TemplatesSyntax): string {
	// eslint-disable-next-line ts/no-unnecessary-condition -- weak types
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
