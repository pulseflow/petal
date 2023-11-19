import path from 'node:path';
import process from 'node:process';
import { color, generateProjectName } from '@astrojs/cli-kit';
import { info, log, title } from '../messages.js';
import type { Context } from './context.js';

import { isEmpty, toValidName } from './shared.js';

type ProjectNameContext = Pick<
	Context,
	'cwd' | 'yes' | 'dryRun' | 'prompt' | 'projectName' | 'exit'
>;

export async function projectName(ctx: ProjectNameContext) {
	await checkCwd(ctx.cwd);

	if (!ctx.cwd || !isEmpty(ctx.cwd)) {
		if (!isEmpty(ctx.cwd)) {
			await info(
				'hmm...',
				`${color.reset(`"${ctx.cwd}"`)}${color.dim(` is not empty!`)}`,
			);
		}

		if (ctx.yes) {
			ctx.projectName = generateProjectName();
			ctx.cwd = `./${ctx.projectName}`;
			await info('dir', `Project dir created at ./${ctx.projectName}`);
			return;
		}

		const { name } = await ctx.prompt({
			name: 'name',
			type: 'text',
			label: title('dir'),
			message: 'where should we create your new project?',
			initial: `./${generateProjectName()}`,
			validate: (value: string) => {
				if (!isEmpty(value))
					return `directory is not empty!`;
				if (value.match(/[^\x20-\x7E]/g) !== null)
					return `invalid non printable character present!`;

				return true;
			},
		});

		ctx.cwd = name!.trim();
		ctx.projectName = toValidName(name!);
		if (ctx.dryRun) {
			await info('--dry-run', 'skipping project naming');
			return;
		}
	}
	else {
		let name = ctx.cwd;
		if (name === '.' || name === './') {
			const parts = process.cwd().split(path.sep);
			name = parts[parts.length - 1];
		}
		else if (name.startsWith('./') || name.startsWith('../')) {
			const parts = name.split('/');
			name = parts[parts.length - 1];
		}

		ctx.projectName = toValidName(name);
	}

	if (!ctx.cwd)
		ctx.exit(1);
}

async function checkCwd(cwd: string | undefined) {
	const empty = cwd && isEmpty(cwd);
	if (empty) {
		log('');
		await info(
			'dir',
			`using ${color.reset(cwd)}${color.dim(' as project directory')}`,
		);
	}

	return empty;
}
