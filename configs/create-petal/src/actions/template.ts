import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { color } from '@astrojs/cli-kit';
import { downloadTemplate } from 'giget';
import { error, info, spinner, title } from '../messages.js';
import type { Context } from './context.js';

type TemplateContext = Pick<
	Context,
	'template' | 'prompt' | 'yes' | 'dryRun' | 'exit'
>;

export async function template(ctx: TemplateContext) {
	if (!ctx.template && ctx.yes)
		ctx.template = 'basics';

	if (ctx.template) {
		await info(
			'tmpl',
			`using ${color.reset(ctx.template)}${color.dim(
				' as project template',
			)}`,
		);
	}
	else {
		const { template: tmpl } = await ctx.prompt({
			name: 'template',
			type: 'select',
			label: title('tmpl'),
			message: 'How would you like to start your new project?',
			initial: 'basics',
			choices: [
				{
					value: 'basics',
					label: 'includes sample files',
					hint: '(recommended)',
				},
				{ value: 'basics-nx', label: 'empty lerna/nx sample files' },
				{
					value: 'basics-turbo',
					label: 'turborepo + petal sample repo',
				},
				{ value: 'rust', label: 'empty rust repository' },
				{ value: 'rust-turbo', label: 'empty rust + petal turborepo' },
				{ value: 'minimal', label: 'empty project template' },
			],
		});
		ctx.template = tmpl;
	}

	if (ctx.dryRun) {
		await info('--dry-run', `skipping template copying`);
	}
	else if (ctx.template) {
		await spinner({
			start: 'template copying...',
			end: 'template copied',
			while: async () =>
				await copyTemplate(ctx.template!, ctx as Context).catch((err) => {
					if (err instanceof Error) {
						error('error', err.message);
						process.exit(1);
					}
					else {
						error('error', 'unable to clone template');
						process.exit(1);
					}
				}),
		});
	}
	else {
		ctx.exit(1);
	}
}

const FILES_TO_REMOVE = ['CHANGELOG.md', '.codesandbox'];
const FILES_TO_UPDATE = {
	'package.json': (file: string, overrides: { name: string }) => fs.promises.readFile(file, 'utf-8').then((value) => {
		const indent = /(^\s+)/m.exec(value)?.[1] ?? '\t';
		fs.promises.writeFile(
			file,
			JSON.stringify(
				Object.assign(
					JSON.parse(value),
					Object.assign(overrides, {
						private: undefined,
						scripts: {
							prepare: 'petal audit',
						},
					}),
				),
				null,
				indent,
			),
			'utf-8',
		);
	}),
};

export function getTemplateTarget(tmpl: string, ref = 'main') {
	return tmpl.includes('/')
		? tmpl
		: `github:pulseflow/petal/examples/${tmpl}#${ref}`;
}

export async function copyTemplate(tmpl: string, ctx: Context) {
	const templateTarget = getTemplateTarget(tmpl, ctx.ref);

	if (!ctx.dryRun) {
		try {
			await downloadTemplate(templateTarget, {
				force: true,
				provider: 'github',
				cwd: ctx.cwd,
				dir: '.',
			});
		}
		catch (err: any) {
			if (
				ctx.cwd !== '.'
				&& ctx.cwd !== './'
				&& !ctx.cwd.startsWith('../')
			) {
				try {
					fs.rmdirSync(ctx.cwd);
				}
				catch (_) {}
			}

			if (err.message.includes('404')) {
				throw new Error(
					`template ${color.reset(tmpl)} ${color.dim(
						'does not exist!',
					)}`,
				);
			}
			else { throw new Error(err.message); }
		}
	}

	if (fs.readdirSync(ctx.cwd).length === 0) {
		throw new Error(
			`template ${color.reset(tmpl)} ${color.dim('is empty!')}`,
		);
	}

	const removeFiles = FILES_TO_REMOVE.map(async (file) => {
		const fileLoc = path.resolve(path.join(ctx.cwd, file));
		if (fs.existsSync(fileLoc))
			return fs.promises.rm(fileLoc, { recursive: true });
	});
	const updateFiles = Object.entries(FILES_TO_UPDATE).map(
		async ([file, update]) => {
			const fileLoc = path.resolve(path.join(ctx.cwd, file));
			if (fs.existsSync(fileLoc))
				return update(fileLoc, { name: ctx.projectName! });
		},
	);

	await Promise.all([...removeFiles, ...updateFiles]);
}

export default copyTemplate;
