import { execa } from 'execa';
import Debug from 'debug';

import { hasConfig } from '@flowr/petal-utils';
import eslintCore from 'eslint/use-at-your-own-risk';
import type { LintTaskDesc } from '../lib/types.js';
import { CONSUMING_ROOT, ESLINT_CONFIG } from '../lib/paths.js';

const { FlatESLint } = eslintCore;

const dbg = Debug('petal/lint');

export function getEslintConfig(): string | undefined {
	if (!hasConfig([
		{ type: 'file', pattern: '.eslintrc.*' },
		{ type: 'file', pattern: 'eslint.config.*' },
		{ type: 'package.json', property: 'eslintConfig' },
	]))
		return ESLINT_CONFIG;

	return undefined;
}

export async function lintTask(task: LintTaskDesc): Promise<string[]> {
	const fns = [];
	if (true)
		fns.push(eslintRun);
	if (task.typecheck)
		fns.push(typeCheck);

	return await Promise.all(
		fns.map(async (fn) => {
			dbg('Beginning %s task', fn.name);
			const stdout = await fn(task);
			dbg('Finished %s task', fn.name);
			return stdout;
		}),
	);
}

export async function eslintRun(task: LintTaskDesc): Promise<string> {
	const eslint = new FlatESLint({
		overrideConfigFile: (task.config || getEslintConfig()) ?? undefined,
		fix: true,
	});
	const results = await eslint.lintFiles([CONSUMING_ROOT]);
	const formatter = await eslint.loadFormatter('stylish');
	const textResults = await formatter.format(results);
	// eslint-disable-next-line no-console
	console.log(textResults);
	return textResults;
}

export async function typeCheck(): Promise<string> {
	const cmd = 'pnpm';
	const args = ['--package=typescript', '--silent', 'dlx', 'tsc', '--noEmit'];
	const stdout = await execa(cmd, args, { stdio: 'inherit' });
	return (stdout || '').toString();
}
