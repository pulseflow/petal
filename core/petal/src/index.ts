import process from 'node:process';
import { program } from 'commander';
import type { Command } from 'commander';

import type {
	AuditTaskDesc,
	BuildTaskDesc,
	LintTaskDesc,
	// TestTaskDesc,
} from './lib/types.js';
import { auditTask } from './tasks/audit.js';
// import {  } from './tasks/test.js';
import { buildTask } from './tasks/build.js';
import { lintTask } from './tasks/lint.js';

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

/*
program
	.command('test')
	.allowUnknownOption()
	.description('Run tests via vitest')
	.option('--config [path]', 'path to vitest config')
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
	*/

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

function handlePromiseResult(result: Promise<any>) {
	result.catch(handleError);
}

function handleError(error: Error & { exitStatus?: number }) {
	// only log if the error is useful (e.g. not the default message from non-zero status is in cross-spawn)
	if (
		error.message
		&& !error.message.includes('Error: Exited with status')
	)
		console.error(error);

	process.exit(error.exitStatus || 1);
}

function getCommand(args: any[]): Command {
	return args[1] as Command;
}

function getOpts(cmd: Command): { [key: string]: any } {
	return cmd.opts();
}

program.parse(process.argv);

if (!process.argv.slice(2).length)
	program.help();
