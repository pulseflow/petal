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
	| 'clean'
	| 'audit';

export type RestOptions = string[];

export interface TaskDesc {
	name: TaskName
	restOptions: RestOptions
}

export type BuildTaskDesc = {
	name: 'build'
	esm: boolean
	types: boolean
} & TaskDesc;

export type TestTaskDesc = {
	name: 'test'
	config?: string
} & TaskDesc;

export type LintTaskDesc = {
	name: 'lint'
	config?: string
	typecheck: boolean
} & TaskDesc;

export type AuditTaskDesc = {
	name: 'audit'
	threshold: ThresholdLimits
} & TaskDesc;

export type CleanTaskDesc = {
	name: 'clean'
} & TaskDesc;
