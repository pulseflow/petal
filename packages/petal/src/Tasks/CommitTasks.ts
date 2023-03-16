import { default as Debug } from 'debug';
import { default as spawn } from 'cross-spawn';
import { default as promiseSpawn } from 'cross-spawn-promise';
import { SpawnSyncReturns } from 'child_process';
// @ts-ignore
import { bootstrap as czBootstrap } from 'commitizen/dist/cli/git-cz';
import { hasConfig } from '@flowr/petal-utils';

import { typeCheck } from './LintTask';
import {
	CommitTaskDesc,
	CommitMsgTaskDesc,
	ReleaseTaskDesc,
	PrecommitTaskDesc,
} from '../SharedTypes';
import { LINT_STAGED_CONFIG } from '../Paths';

export function getLintStagedConfig(): string | null {
	if (
		!hasConfig([
			{ type: 'file', pattern: 'lint-staged.config.js' },
			{ type: 'file', pattern: '.lintstagedrc*' },
			{ type: 'package.json', property: 'lint-staged' },
		])
	) {
		return LINT_STAGED_CONFIG;
	}

	return null;
}

const dbg = Debug('petal:commit'); // eslint-disable-line new-cap

export async function precommitTask(
	task: PrecommitTaskDesc,
): Promise<string[]> {
	const fns: Array<(task?: PrecommitTaskDesc) => Promise<string>> = [];
	if (task.typecheck) {
		fns.push(typeCheck);
	}

	const results = await Promise.all(
		fns.map(async fn => {
			dbg('Beginning %s task', fn.name);
			const stdout = await fn(task);
			dbg('Finished %s task', fn.name);
			return stdout;
		}),
	);

	results.push(await lintStaged(task));

	return results;
}

export async function lintStaged(task: PrecommitTaskDesc): Promise<string> {
	const config = getLintStagedConfig();
	const cmd = 'pnpm';
	const args = [
		'--silent',
		'dlx',
		'lint-staged',
		...(config ? ['--config', config] : []),
		...task.restOptions,
	];
	dbg('pnpm dlx args %o', args);

	const env: { [key: string]: string } = {
		...process.env,
		WEB_SCRIPTS_RUN_TESTS: task.tests.toString(),
	};

	if (task.eslintConfig) {
		env.WEB_SCRIPTS_ESLINT_CONFIG = task.eslintConfig;
	}
	if (task.jestConfig) {
		env.WEB_SCRIPTS_JEST_CONFIG = task.jestConfig;
	}
	if (task.prettierConfig) {
		env.WEB_SCRIPTS_PRETTIER_CONFIG = task.prettierConfig;
	}

	const stdout = await promiseSpawn(cmd, args, {
		stdio: 'inherit',
		env,
	});

	return (stdout || '').toString();
}

export function commitTask(task: CommitTaskDesc): void {
	dbg('running commitizen commit', task.restOptions);

	const cliPath = require
		.resolve('commitizen/package.json')
		.replace('package.json', '');

	Object.assign(process.env, {
		CZ_TYPE: process.env.CZ_TYPE || ' ',
		CZ_SCOPE: process.env.CZ_SCOPE || ' ',
		CZ_SUBJECT: process.env.CZ_SUBJECT || ' ',
		CZ_BODY: process.env.CZ_BODY || ' ',
		CZ_ISSUES: process.env.CZ_ISSUES || ' ',
		CZ_MAX_HEADER_WIDTH: process.env.CZ_MAX_HEADER_WIDTH || 100,
		CZ_MAX_LINE_WIDTH: process.env.CZ_MAX_LINE_WIDTH || 100,
	});

	return czBootstrap(
		{
			cliPath,
			config: {
				path: task.path,
			},
		},
		[null, ...task.restOptions],
	);
}

export function commitMsgTask(
	task: CommitMsgTaskDesc,
): SpawnSyncReturns<Buffer> {
	const cmd = 'pnpm';
	const args = [
		'--silent',
		'dlx',
		'commitlint',
		`--config=${task.config}`,
		`--edit=${task.edit || process.env.HUSKY_GIT_PARAMS}`,
		...task.restOptions,
	];
	dbg('pnpm dlx args %o', args);
	return spawn.sync(cmd, args, { stdio: 'inherit' });
}

export function releaseTask(task: ReleaseTaskDesc): SpawnSyncReturns<Buffer> {
	const cmd = 'pnpm';
	const args = [
		'--silent',
		'dlx',
		'semantic-release',
		'--branches="main"',
		...task.restOptions,
	];
	dbg('pnpm dlx args %o', args);
	return spawn.sync(cmd, args, { stdio: 'inherit' });
}
