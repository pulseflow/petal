import { default as Debug } from 'debug';
import { default as spawn } from 'cross-spawn/index.js';
import { SpawnSyncReturns } from 'node:child_process';
import { hasConfig } from '@flowr/petal-utils';

import { FormatTaskDesc } from '../../SharedTypes.js';
import { PRETTIER_CONFIG, CONSUMING_ROOT } from '../../Paths.js';

const dbg = Debug('petal:format'); // eslint-disable-line new-cap

export function getPrettierConfig(): string | null {
	if (
		!hasConfig([
			{ type: 'file', pattern: '.prettierrc' },
			{ type: 'file', pattern: 'prettier.config.cjs' },
			{ type: 'file', pattern: 'prettier.config.js' },
			{ type: 'package.json', property: 'prettierrc' },
		])
	) {
		return PRETTIER_CONFIG;
	}

	return null;
}

export function formatTask(task: FormatTaskDesc): SpawnSyncReturns<Buffer> {
	const cmd = 'pnpm';
	const config = task.config || getPrettierConfig();
	const path = task.path || `${CONSUMING_ROOT}/**/src`;

	const args = [
		'--silent',
		'dlx',
		'prettier',
		...(config ? ['--config', config] : []),
		'--write',
		`${path}/**/*.{ts,tsx,js,jsx}`,
	];
	dbg('pnpm dlx args %o', args);
	return spawn.sync(cmd, args, { stdio: 'inherit' });
}
