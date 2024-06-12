import type { ESLint, Linter } from 'eslint';
import { version } from '../package.json';
import ifNewline from './rules/if-newline';
import importDedupe from './rules/import-dedupe';
import topLevelFunction from './rules/top-level-function';
import noImportNodeModulesByPath from './rules/no-import-node-modules-by-path';
import noImportDist from './rules/no-import-dist';
import noOnlyTests from './rules/no-only-tests';
import noTsExportEqual from './rules/no-ts-export-equal';
import consistentListNewline from './rules/consistent-list-newline';
import indentUnindent from './rules/indent-unindent';
import onlyExportComponents from './rules/only-export-components';

const plugin = {
	meta: {
		name: 'petal',
		version,
	},
	/// @keep-sorted
	rules: {
		'consistent-list-newline': consistentListNewline,
		'if-newline': ifNewline,
		'import-dedupe': importDedupe,
		'indent-unindent': indentUnindent,
		'no-import-node-modules-by-path': noImportNodeModulesByPath,
		'no-import-dist': noImportDist,
		'no-only-tests': noOnlyTests,
		'only-export-components': onlyExportComponents,
		'no-ts-export-equal': noTsExportEqual,
		'top-level-function': topLevelFunction,
	},
} satisfies ESLint.Plugin;

export default plugin;

export type RuleOptions = { [K in keyof typeof plugin['rules']]: typeof plugin['rules'][K]['defaultOptions'] };
export type Rules = { [K in keyof RuleOptions]: Linter.RuleEntry<RuleOptions[K]> };
