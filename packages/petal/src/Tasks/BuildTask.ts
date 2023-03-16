import { BuildTaskDesc } from '../SharedTypes';

import { default as Debug } from 'debug';
import { default as spawn } from 'cross-spawn-promise';
const dbg = Debug('petal:build'); // eslint-disable-line new-cap

export async function buildTask(task: BuildTaskDesc): Promise<string[]> {
	const fns = [];

	if (!task.cjs && !task.esm && !task.types) {
		fns.push(buildTypes, buildCJS, buildESM);
	} else {
		if (task.types) fns.push(buildTypes);
		if (task.esm) fns.push(buildESM);
		if (task.cjs) fns.push(buildCJS);
	}

	return Promise.all(
		fns.map(async fn => {
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
		'CommonJS',
		...task.restOptions,
	];
	const stdout = await spawn(cmd, args, { stdio: 'inherit' });
	return (stdout || '').toString();
}

async function buildCJS(task: BuildTaskDesc): Promise<string> {
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
		'cjs',
		'--noEmit',
		'false',
		'--module',
		'CommonJS',
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
		'esm',
		'--noEmit',
		'false',
		'--module',
		'ESNext',
		...task.restOptions,
	];
	const stdout = await spawn(cmd, args, { stdio: 'inherit' });
	return (stdout || '').toString();
}
