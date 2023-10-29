import { mkdir, writeFile } from 'node:fs/promises';
import { rmSync } from 'node:fs';

import { git } from './git.js';
import { setup } from '../testUtils.js';

describe('git', () => {
	const fixture = setup();

	it('none', async () => {
		const context = { cwd: '', dryRun: true, prompt: () => ({ git: false }) };
		await git(context as any);

		expect(fixture.hasMessage('skipping git init')).toBe(true);
	});

	it('yes (--dry-run)', async () => {
		const context = { cwd: '', dryRun: true, prompt: () => ({ git: true }) };
		await git(context as any);

		expect(fixture.hasMessage('skipping git init')).toBe(true);
	});

	it('no (--dry-run)', async () => {
		const context = { cwd: '', dryRun: true, prompt: () => ({ git: false }) };
		await git(context as any);

		expect(fixture.hasMessage('skipping git init')).toBe(true);
	});
});

describe('git initialized', () => {
	const fixture = setup();
	const dir = new URL(new URL('./fixtures/not-empty/.git', import.meta.url));

	beforeAll(async () => {
		await mkdir(dir, { recursive: true });
		await writeFile(new URL('./git.json', dir), '{}', { encoding: 'utf8' });
	});

	it('already initialized', async () => {
		const context = {
			git: true,
			cwd: './test/fixtures/not-empty',
			dryRun: false,
			prompt: () => ({ git: false }),
		};
		await git(context as any);

		expect(fixture.hasMessage('git has already been initialized')).toBe(true);
	});

	afterAll(() => {
		rmSync(dir, { recursive: true, force: true });
	});
});
