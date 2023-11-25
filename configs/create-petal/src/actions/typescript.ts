import { readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { color } from '@astrojs/cli-kit';
import stripJsonComments from 'strip-json-comments';
import {
	error,
	info,
	spinner,
	title,
	typescript as tsDefault,
} from '../messages.js';
import type { Context } from './context.js';

type TypescriptContext = Pick<
	Context,
	| 'typescript'
	| 'yes'
	| 'prompt'
	| 'dryRun'
	| 'cwd'
	| 'exit'
	| 'packageManager'
	| 'install'
>;

export async function typescript(ctx: TypescriptContext) {
	let ts
		= ctx.typescript
		?? (typeof ctx.yes !== 'undefined' ? 'strict' : undefined);

	if (ts === undefined) {
		const { useTs } = await ctx.prompt({
			name: 'useTs',
			type: 'confirm',
			label: title('ts'),
			message: `do you plan to write typescript?`,
			initial: true,
		});

		if (!useTs) {
			await tsDefault();
			return;
		}

		({ ts } = await ctx.prompt({
			name: 'ts',
			type: 'select',
			label: title('use'),
			message: `how strict should typescript be?`,
			initial: 'strict',
			choices: [
				{ value: 'strict', label: 'Strict', hint: `(recommended)` },
				{ value: 'esm', label: 'ESM' },
				{ value: 'strictest', label: 'Strictest' },
				{ value: 'base', label: 'Relaxed' },
			],
		}));
	}
	else {
		if (
			![
				'strict',
				'strictest',
				'relaxed',
				'default',
				'base',
				'esm',
			].includes(ts)
		) {
			if (!ctx.dryRun)
				await rm(ctx.cwd, { recursive: true, force: true });
			error(
				'error',
				`unknown typescript option ${color.reset(ts)}${color.dim(
					'! expected strict | strictest | relaxed | base | esm',
				)}`,
			);
			ctx.exit(1);
		}

		await info(
			'ts',
			`using ${color.reset(ts)}${color.dim(' typescript config')}`,
		);
	}

	if (ctx.dryRun) {
		await info('--dry-run', `skipping typescript setup`);
	}
	else if (ts && ts !== 'unsure') {
		if (ts === 'relaxed' || ts === 'default')
			ts = 'base';
		await spinner({
			start: 'typescript customizing...',
			end: 'typescript customized',
			while: () =>
				setupTypescript(ts!, ctx).catch((err) => {
					error('error', err);
					process.exit(1);
				}),
		});
	}
	else {
		// do nothing
	}
}

const FILES_TO_UPDATE = {
	'tsconfig.json': async (file: string, options: { value: string }) => {
		try {
			const data = await readFile(file, { encoding: 'utf-8' });
			const templateTSConfig = JSON.parse(stripJsonComments(data));
			if (templateTSConfig && typeof templateTSConfig === 'object') {
				const result = Object.assign(templateTSConfig, {
					extends: `@flowr/petal/config/tsconfig.${options.value}.json`,
				});

				await writeFile(file, JSON.stringify(result, null, 2));
			}
			else {
				throw new Error(
					`there was an error applying typescript settings.`,
				);
			}
		}
		catch (err: any) {
			if (err && err.code === 'ENOENT') {
				await writeFile(
					file,
					JSON.stringify(
						{
							extends: `@flowr/petal/config/tsconfig.${options.value}.json`,
						},
						null,
						2,
					),
				);
			}
		}
	},
};

export async function setupTypescript(value: string,	ctx: TypescriptContext) {
	await Promise.all(
		Object.entries(FILES_TO_UPDATE).map(async ([file, update]) =>
			update(path.resolve(path.join(ctx.cwd, file)), { value }),
		),
	);
}
