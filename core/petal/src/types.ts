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
	| 'commit'
	| 'commitmsg'
	| 'clean'
	| 'precommit'
	| 'release'
	| 'audit';

export type RestOptions = string[];

export type TaskDesc = {
	name: TaskName;
	restOptions: RestOptions;
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
	typecheck: boolean;
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
} & TaskDesc;

export type CleanTaskDesc = {
	name: 'clean';
} & TaskDesc;
