import Debug from 'debug';
import spawn from 'cross-spawn-promise';
import type { BuildTaskDesc } from '../types.js';

const dbg = Debug('petal:build');

export async function buildTask(task: BuildTaskDesc): Promise<string[]> {
	const fns = [];

	if (!task.esm && !task.types) {
		fns.push(buildTypes, buildESM);
	}
	else {
		if (task.types)
			fns.push(buildTypes);
		if (task.esm)
			fns.push(buildESM);
	}

	return Promise.all(
		fns.map(async (fn) => {
			dbg('Beginning %s task', fn.name);
			const result = await fn(task);
			dbg('Finished %s task', fn.name);
			return result;
		}),
	);
}

async function buildTypes(task: BuildTaskDesc): Promise<string> {
	const cmd = 'pnpm';
	const args = [
		'--package=typescript',
		'--silent',
		'dlx',
		'tsc',
		'--declaration',
		'--declarationMap',
		'--isolatedModules',
		'false',
		'--outDir',
		'types',
		'--emitDeclarationOnly',
		'--noEmit',
		'false',
		'--module',
		'NodeNext',
		...task.restOptions,
	];
	const stdout = await spawn(cmd, args, { stdio: 'inherit' });
	return (stdout || '').toString();
}

async function buildESM(task: BuildTaskDesc): Promise<string> {
	const cmd = 'pnpm';
	const args = [
		'--package=typescript',
		'--silent',
		'dlx',
		'tsc',
		'--declaration',
		'false',
		'--allowJs',
		'--outDir',
		'build',
		'--noEmit',
		'false',
		'--module',
		'NodeNext',
		...task.restOptions,
	];
	const stdout = await spawn(cmd, args, { stdio: 'inherit' });
	return (stdout || '').toString();
}
