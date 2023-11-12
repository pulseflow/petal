type ThresholdLimits =
	| 'info'
	| 'low'
	| 'moderate'
	| 'high'
	| 'critical'
	| 'none';

export type TaskName =
	| 'init'
	| 'build'
	| 'test'
	| 'lint'
	| 'format'
	| 'commit'
	| 'commitmsg'
	| 'precommit'
	| 'release'
	| 'audit';

export type TaskDesc = {
	name: TaskName;
	restOptions: string[];
};

export type BuildTaskDesc = {
	name: 'build';
	esm: boolean;
	types: boolean;
} & TaskDesc;

export type TestTaskDesc = {
	name: 'test';
	config?: string;
} & TaskDesc;

export type LintTaskDesc = {
	name: 'lint';
	config?: string;
	stylecheck: boolean;
	typecheck: boolean;
} & TaskDesc;

export type FormatTaskDesc = {
	name: 'format';
	config?: string;
	path?: string;
} & TaskDesc;

export type CommitTaskDesc = {
	name: 'commit';
	path: string;
} & TaskDesc;

export type CommitMsgTaskDesc = {
	name: 'commitmsg';
	config: string;
	edit?: string;
} & TaskDesc;

export type ReleaseTaskDesc = {
	name: 'release';
} & TaskDesc;

export type AuditTaskDesc = {
	name: 'audit';
	threshold: ThresholdLimits;
} & TaskDesc;

export type PrecommitTaskDesc = {
	name: 'precommit';
	tests: boolean;
	typecheck: boolean;
	eslintConfig: string;
	jestConfig: string;
	prettierConfig: string;
} & TaskDesc;
