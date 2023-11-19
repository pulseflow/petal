import type { ESLint, Linter } from 'eslint';
import genericSpacing from './rules/generic-spacing.js';
import ifNewline from './rules/if-newline.js';
import importDedupe from './rules/import-dedupe.js';
import preferInlineTypeImport from './rules/prefer-inline-type-import.js';
import topLevelFunction from './rules/top-level-function.js';
import noImportNodeModulesByPath from './rules/no-import-node-modules-by-path.js';
import noTsExportEqual from './rules/no-ts-export-equal.js';
import noCjsExports from './rules/no-cjs-exports.js';
import namedTupleSpacing from './rules/named-tuple-spacing.js';
import consistentListNewline from './rules/consistent-list-newline.js';
import indentBinaryOps from './rules/indent-binary-ops.js';

import { readFileSync } from 'node:fs';
const { version } = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), 'utf-8'));

const plugin = {
	meta: {
		name: 'petal',
		version,
	},
	rules: {
		'consistent-list-newline': consistentListNewline,
		'generic-spacing': genericSpacing,
		'if-newline': ifNewline,
		'import-dedupe': importDedupe,
		'named-tuple-spacing': namedTupleSpacing,
		'no-cjs-exports': noCjsExports,
		'no-import-node-modules-by-path': noImportNodeModulesByPath,
		'no-ts-export-equal': noTsExportEqual,
		'prefer-inline-type-import': preferInlineTypeImport,
		'top-level-function': topLevelFunction,
		'indent-binary-ops': indentBinaryOps,
	},
} satisfies ESLint.Plugin;

export default plugin;

type RuleDefinitions = typeof plugin['rules'];

export type RuleOptions = {
	[K in keyof RuleDefinitions]: RuleDefinitions[K]['defaultOptions'];
};

export type Rules = {
	[K in keyof RuleOptions]: Linter.RuleEntry<RuleOptions[K]>;
};
