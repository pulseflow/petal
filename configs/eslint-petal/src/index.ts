import { readFileSync } from 'node:fs';
import type { ESLint, Linter } from 'eslint';
import ifNewline from './rules/if-newline.js';
import importDedupe from './rules/import-dedupe.js';
import preferInlineTypeImport from './rules/prefer-inline-type-import.js';
import topLevelFunction from './rules/top-level-function.js';
import noImportNodeModulesByPath from './rules/no-import-node-modules-by-path.js';
import noImportDist from './rules/no-import-dist.js';
import noTsExportEqual from './rules/no-ts-export-equal.js';
import consistentListNewline from './rules/consistent-list-newline.js';

const { version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf-8'));

const plugin = {
	meta: {
		name: 'petal',
		version,
	},
	rules: {
		'consistent-list-newline': consistentListNewline,
		'if-newline': ifNewline,
		'import-dedupe': importDedupe,
		'no-import-node-modules-by-path': noImportNodeModulesByPath,
		'no-import-dist': noImportDist,
		'no-ts-export-equal': noTsExportEqual,
		'prefer-inline-type-import': preferInlineTypeImport,
		'top-level-function': topLevelFunction,
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
