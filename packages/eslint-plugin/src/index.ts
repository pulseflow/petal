import type { FlatConfig } from '@typescript-eslint/utils/ts-eslint';
import type { Linter } from 'eslint';
import { version } from '../package.json';
import * as consistentChaining from './rules/consistent-chaining';
import * as consistentListNewline from './rules/consistent-list-newline';
import * as fileHeader from './rules/file-header';
import * as ifNewline from './rules/if-newline';
import * as importDedupe from './rules/import-dedupe';
import * as indentUnindent from './rules/indent-unindent';
import * as noImportDist from './rules/no-import-dist';
import * as noImportNodeModulesByPath from './rules/no-import-node-modules-by-path';
import * as noOnlyTests from './rules/no-only-tests';
import * as noTsExportEqual from './rules/no-ts-export-equal';
import * as onlyExportComponents from './rules/only-export-components';
import * as topLevelFunction from './rules/top-level-function';

const rules: Readonly<{
	[consistentChaining.RULE_NAME]: typeof consistentChaining.default;
	[consistentListNewline.RULE_NAME]: typeof consistentListNewline.default;
	[fileHeader.RULE_NAME]: typeof fileHeader.default;
	[ifNewline.RULE_NAME]: typeof ifNewline.default;
	[importDedupe.RULE_NAME]: typeof importDedupe.default;
	[indentUnindent.RULE_NAME]: typeof indentUnindent.default;
	[noImportNodeModulesByPath.RULE_NAME]: typeof noImportNodeModulesByPath.default;
	[noImportDist.RULE_NAME]: typeof noImportDist.default;
	[noOnlyTests.RULE_NAME]: typeof noOnlyTests.default;
	[onlyExportComponents.RULE_NAME]: typeof onlyExportComponents.default;
	[noTsExportEqual.RULE_NAME]: typeof noTsExportEqual.default;
	[topLevelFunction.RULE_NAME]: typeof topLevelFunction.default;
}> = {
	[consistentChaining.RULE_NAME]: consistentChaining.default,
	[consistentListNewline.RULE_NAME]: consistentListNewline.default,
	[fileHeader.RULE_NAME]: fileHeader.default,
	[ifNewline.RULE_NAME]: ifNewline.default,
	[importDedupe.RULE_NAME]: importDedupe.default,
	[indentUnindent.RULE_NAME]: indentUnindent.default,
	[noImportDist.RULE_NAME]: noImportDist.default,
	[noImportNodeModulesByPath.RULE_NAME]: noImportNodeModulesByPath.default,
	[noOnlyTests.RULE_NAME]: noOnlyTests.default,
	[noTsExportEqual.RULE_NAME]: noTsExportEqual.default,
	[onlyExportComponents.RULE_NAME]: onlyExportComponents.default,
	[topLevelFunction.RULE_NAME]: topLevelFunction.default,
};
const meta = {
	name: 'petal',
	version,
} as const;

const plugin = {
	meta,
	rules,
} satisfies FlatConfig.Plugin;

type ESLintPluginPetal = FlatConfig.Plugin & {
	meta: typeof meta;
	rules: typeof rules;
};

export default plugin as ESLintPluginPetal;
export type RuleOptions = { [K in keyof typeof plugin['rules']]: typeof plugin['rules'][K]['defaultOptions'] };
export type Rules = { [K in keyof RuleOptions]: Linter.RuleEntry<RuleOptions[K]> };
