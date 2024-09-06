import type { ESLint, Linter } from 'eslint';
import { version } from '../package.json';
import consistentChaining from './rules/consistent-chaining';
import consistentListNewline from './rules/consistent-list-newline';
import fileHeader from './rules/file-header';
import ifNewline from './rules/if-newline';
import importDedupe from './rules/import-dedupe';
import indentUnindent from './rules/indent-unindent';
import noImportDist from './rules/no-import-dist';
import noImportNodeModulesByPath from './rules/no-import-node-modules-by-path';
import noOnlyTests from './rules/no-only-tests';
import noTsExportEqual from './rules/no-ts-export-equal';
import onlyExportComponents from './rules/only-export-components';
import topLevelFunction from './rules/top-level-function';
import type { RuleModule } from './utils';

const plugin = {
	meta: {
		name: 'petal',
		version,
	},
	/// @keep-sorted
	rules: {
		'consistent-chaining': consistentChaining,
		'consistent-list-newline': consistentListNewline,
		'file-header': fileHeader,
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
} satisfies Omit<ESLint.Plugin, 'rules'> & {
	rules?: Record<string, RuleModule<readonly unknown[], string>>;
};

export default plugin;

export type RuleOptions = { [K in keyof typeof plugin['rules']]: typeof plugin['rules'][K]['defaultOptions'] };
export type Rules = { [K in keyof RuleOptions]: Linter.RuleEntry<RuleOptions[K]> };
