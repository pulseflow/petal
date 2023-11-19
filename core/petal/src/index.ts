import { program, Command } from 'commander';
import { SpawnSyncReturns } from 'node:child_process';
import process from 'node:process';
import { Buffer } from 'node:buffer';

import {
	AuditTaskDesc,
	BuildTaskDesc,
	CommitTaskDesc,
	CommitMsgTaskDesc,
	LintTaskDesc,
	PrecommitTaskDesc,
	ReleaseTaskDesc,
	TestTaskDesc,
} from './types.js';
import { COMMITLINT_CONIFG } from './paths.js';
import { auditTask } from './tasks/audit.js';
import { testTask } from './tasks/test.js';
import { buildTask } from './tasks/build.js';
import { lintTask } from './tasks/lint.js';
import {
	commitTask,
	commitMsgTask,
	releaseTask,
	precommitTask,
} from './tasks/commit.js';

program
	.command('build')
	.allowUnknownOption()
	.description('Build your project into esm and types folders')
	.option('--no-esm', 'do not build esm target')
	.option('--no-types', 'do not build types target')
	.action((...args) => {
		const cmd = getCommand(args);
		const { esm, types } = getOpts(cmd);
		const t: BuildTaskDesc = {
			name: 'build',
			esm,
			types,
			restOptions: cmd.args,
		};

		handlePromiseResult(buildTask(t));
	});

program
	.command('test')
	.allowUnknownOption()
	.description('Run tests via jest')
	.option('--config [path]', 'path to jest config')
	.action(async (...args) => {
		const cmd = getCommand(args);
		const { config } = getOpts(cmd);
		const t: TestTaskDesc = {
			name: 'test',
			config,
			restOptions: cmd.args,
		};

		const result = testTask(t);
		handlePromiseResult(result);
	});

program
	.command('lint')
	.allowUnknownOption()
	.description('Run ESLint and TypeScript to statically analyze your code')
	.option('--config [path]', 'path to ESLint config')
	.option('--typecheck', 'run a TypeScript type check', true)
	.option('--no-typecheck', 'do not run a TypeScript type check')
	.action((...args) => {
		const cmd = getCommand(args);
		const { typecheck, config } = getOpts(cmd);
		const t: LintTaskDesc = {
			name: 'lint',
			config,
			typecheck,
			restOptions: cmd.args,
		};

		handlePromiseResult(lintTask(t));
	});

program
	.command('precommit')
	.allowUnknownOption()
	.description('Locally validate the repo before committing')
	.option('--jest-config [path]', 'path to jest config')
	.option('--eslint-config [path]', 'path to eslint config')
	.option('--no-tests', 'Do not run Jest tests')
	.option('--no-typecheck', 'Do not type check using TypeScript')
	.action((...args) => {
		const cmd = getCommand(args);
		const { tests, typecheck, jestConfig, eslintConfig } =
			getOpts(cmd);
		const t: PrecommitTaskDesc = {
			name: 'precommit',
			tests,
			typecheck,
			jestConfig,
			eslintConfig,
			restOptions: cmd.args,
		};

		handlePromiseResult(precommitTask(t));
	});

function thresholdLimiter(value: string, defaultValue: string) {
	switch (value) {
		case 'info':
		case 'low':
		case 'moderate':
		case 'high':
		case 'critical':
			return value;
		default:
			return defaultValue;
	}
}

program
	.command('audit')
	.alias('postinstall')
	.allowUnknownOption()
	.description(
		`Run yarn audit and exit non-zero if the security vulnerability threshold is breached`,
	)
	.option(
		'--threshold [info|low|moderate|high|critical]',
		'The amount of permissible vulnerabilities',
		thresholdLimiter,
		'none',
	)
	.action((...args) => {
		const cmd = getCommand(args);
		const { threshold } = getOpts(cmd);
		const t: AuditTaskDesc = {
			name: 'audit',
			threshold,
			restOptions: cmd.args,
		};

		handlePromiseResult(auditTask(t));
	});

program
	.command('commit')
	.allowUnknownOption()
	.description('Create Commitizen commit from staged files')
	.option(
		'--path [path]',
		'path for commitizen adapter to use',
		'cz-conventional-changelog',
	)
	.action((...args) => {
		const cmd = getCommand(args);
		const { path } = getOpts(cmd);
		const t: CommitTaskDesc = {
			name: 'commit',
			path,
			restOptions: cmd.args,
		};

		try {
			commitTask(t);
		} catch (err) {
			handleError(err as Error & { exitStatus?: number });
		}
	});

program
	.command('commitmsg')
	.allowUnknownOption()
	.description('Run commitizen commit message validation hook')
	.option(
		'--config [path]',
		'path to the commitlint config.',
		COMMITLINT_CONIFG,
	)
	.option(
		'--edit [path]',
		'read last commit message from the specified file (only necessary when using Husky v6).',
	)
	.action((...args) => {
		const cmd = getCommand(args);
		const { config, edit } = getOpts(cmd);
		const t: CommitMsgTaskDesc = {
			name: 'commitmsg',
			config,
			edit,
			restOptions: cmd.args,
		};

		handleSpawnResult(commitMsgTask(t));
	});

program
	.command('release')
	.allowUnknownOption()
	.description('Run semantic-release')
	.action((...args) => {
		const cmd = getCommand(args);
		const t: ReleaseTaskDesc = {
			name: 'release',
			restOptions: cmd.args,
		};

		handleSpawnResult(releaseTask(t));
	});

function handlePromiseResult(result: Promise<any>) {
	result.catch(handleError);
}

function handleError(error: Error & { exitStatus?: number }) {
	/* eslint-disable no-console */
	// only log if the error is useful (e.g. not the default message from non-zero status is in cross-spawn)
	if (
		error.message &&
		error.message.indexOf('Error: Exited with status') < 0
	) {
		console.error(error);
	}
	/* eslint-enable no-console */
	process.exit(error.exitStatus || 1);
}

function handleSpawnResult(result: SpawnSyncReturns<Buffer>) {
	if (result.error) {
		throw result.error;
	}

	if (result.status !== 0) {
		process.exit(result.status === null ? 0 : result.status);
	}
}

function getCommand(args: any[]): Command {
	return args[1] as Command;
}

function getOpts(cmd: Command): { [key: string]: any } {
	return cmd.opts();
}

program.parse(process.argv);

if (!process.argv.slice(2).length) {
	program.help();
}
