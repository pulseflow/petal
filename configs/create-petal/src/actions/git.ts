import fs from 'node:fs';
import path from 'node:path';
import type { Context } from './context.js';

import { color } from '@astrojs/cli-kit';
import { error, info, spinner, title } from '../messages.js';
import { shell } from '../shell.js';

type GitContext = Pick<Context, 'cwd' | 'git' | 'yes' | 'prompt' | 'dryRun'>;

export const git = async (ctx: GitContext) => {
	if (fs.existsSync(path.join(ctx.cwd, '.git'))) {
		await info('git setup', `git has already been initialized`);
		return;
	}

	let _git = ctx.git ?? ctx.yes;
	if (_git === undefined) {
		({ git: _git } = await ctx.prompt({
			name: 'git',
			type: 'confirm',
			label: title('git'),
			message: `initialize a new git repo?`,
			hint: 'optional',
			initial: true,
		}));
	}

	if (ctx.dryRun) {
		await info('--dry-run', 'skipping git init');
	} else if (_git) {
		await spinner({
			start: 'creating git repository...',
			end: 'git has been initialized',
			while: () =>
				init({ cwd: ctx.cwd }).catch(err => {
					error('error', err);
					process.exit(1);
				}),
		});
	} else {
		await info(
			ctx.yes === false ? 'git [skip]' : 'sounds good!',
			`you can always run ${color.reset('git init')}${color.dim(
				' manually.',
			)}`,
		);
	}
};

const init = async ({ cwd }: { cwd: string }) => {
	try {
		await shell('git', ['init'], { cwd, stdio: 'ignore' });
		await shell('git', ['add', '-A'], { cwd, stdio: 'ignore' });
		await shell(
			'git',
			[
				'commit',
				'-m',
				'chore(petal): init',
				'--author="petal[bot] <petalpulse@users.noreply.github.com>"',
			],
			{ cwd, stdio: 'ignore' },
		);
	} catch (err) {}
};
