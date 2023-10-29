import os from 'node:os';
import { getContext } from './context.js';

describe('context', () => {
	it('no arguments', async () => {
		const ctx = await getContext([]);
		expect(ctx.projectName).toBe(undefined);
		expect(ctx.template).toBe(undefined);
		expect(ctx.skipFlower).toEqual(os.platform() === 'win32');
		expect(ctx.dryRun).toBe(undefined);
	});
	it('project name', async () => {
		const ctx = await getContext(['foobar']);
		expect(ctx.projectName).toEqual('foobar');
	});
	it('template', async () => {
		const ctx = await getContext(['--template', 'minimal']);
		expect(ctx.template).toEqual('minimal');
	});
	it('skip flower (explicit)', async () => {
		const ctx = await getContext(['--skip-flower']);
		expect(ctx.skipFlower).toEqual(true);
	});
	it('skip flower (yes)', async () => {
		const ctx = await getContext(['-y']);
		expect(ctx.skipFlower).toEqual(true);
	});
	it('skip flower (no)', async () => {
		const ctx = await getContext(['-n']);
		expect(ctx.skipFlower).toEqual(true);
	});
	it('skip flower (install)', async () => {
		const ctx = await getContext(['--install']);
		expect(ctx.skipFlower).toEqual(true);
	});
	it('dry run', async () => {
		const ctx = await getContext(['--dry-run']);
		expect(ctx.dryRun).toEqual(true);
	});
	it('install', async () => {
		const ctx = await getContext(['--install']);
		expect(ctx.install).toEqual(true);
	});
	it('no install', async () => {
		const ctx = await getContext(['--no-install']);
		expect(ctx.install).toEqual(false);
	});
	it('git', async () => {
		const ctx = await getContext(['--git']);
		expect(ctx.git).toEqual(true);
	});
	it('no git', async () => {
		const ctx = await getContext(['--no-git']);
		expect(ctx.git).toEqual(false);
	});
	it('typescript', async () => {
		const ctx = await getContext(['--typescript', 'strict']);
		expect(ctx.typescript).toEqual('strict');
	});
});
