import { default as spawn } from 'cross-spawn';
import { default as Debug } from 'debug';
import { SpawnSyncReturns } from 'child_process';
import { hasConfig } from '@flowr/petal-utils';

import { TestTaskDesc } from '../SharedTypes';
import { JEST_CONFIG } from '../Paths';

const dbg = Debug('petal:test'); // eslint-disable-line new-cap

export function getJestConfig(): string | null {
	if (
		!hasConfig([
			{ type: 'file', pattern: 'jest.config.js' },
			{ type: 'package.json', property: 'jest' },
		])
	) {
		return JEST_CONFIG;
	}

	return null;
}

export function testTask(task: TestTaskDesc): SpawnSyncReturns<Buffer> {
	const cmd = 'pnpm';
	const config = task.config || getJestConfig();

	const args = [
		'--silent',
		'dlx',
		'jest',
		...(config ? ['--config', config] : []),
		...task.restOptions,
	];
	dbg('pnpm dlx args %o', args);
	return spawn.sync(cmd, args, { stdio: 'inherit' });
}
