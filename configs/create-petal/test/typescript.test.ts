import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';

import { setupTypescript, typescript } from '../src/actions/typescript.js';
import { resetFixtures, setup } from './testUtils.js';

describe('typescript', () => {
	const fixture = setup();

	it('none', async () => {
		const context = {
			cwd: '',
			dryRun: true,
			prompt: () => ({ ts: 'strict', useTs: true }),
		};
		await typescript(context as any);

		expect(fixture.hasMessage('skipping typescript setup')).toBe(true);
	});

	it('use false', async () => {
		const context = {
			cwd: '',
			dryRun: true,
			prompt: () => ({ ts: 'strict', useTs: false }),
		};
		await typescript(context as any);

		expect(fixture.hasMessage('no worries!')).toBe(true);
	});

	it('strict', async () => {
		const context = {
			typescript: 'strict',
			cwd: '',
			dryRun: true,
			prompt: () => ({ ts: 'strict' }),
		};
		await typescript(context as any);

		expect(fixture.hasMessage('skipping typescript setup')).toBe(true);
	});

	it('default', async () => {
		const context = {
			typescript: 'default',
			cwd: '',
			dryRun: true,
			prompt: () => ({ ts: 'strict' }),
		};
		await typescript(context as any);

		expect(fixture.hasMessage('skipping typescript setup')).toBe(true);
	});

	it('relaxed', async () => {
		const context = {
			typescript: 'relaxed',
			cwd: '',
			dryRun: true,
			prompt: () => ({ ts: 'strict' }),
		};
		await typescript(context as any);

		expect(fixture.hasMessage('skipping typescript setup')).toBe(true);
	});

	it('other', async () => {
		const context = {
			typescript: 'other',
			cwd: '',
			dryRun: true,
			prompt: () => ({ ts: 'strict' }),
			exit(code: number) {
				throw code;
			},
		};
		let err = null;
		try {
			await typescript(context as any);
		}
		catch (e) {
			err = e;
		}
		expect(err).toEqual(1);
	});
});

describe('typescript: setup tsconfig', () => {
	beforeEach(() => {
		resetFixtures();
	});

	it('exists', async () => {
		const root = new URL('./fixtures/not-empty', import.meta.url);
		const tsconfig = join(fileURLToPath(root), './tsconfig.json');
		await setupTypescript('strict', { cwd: fileURLToPath(root) } as any);
		expect(
			JSON.parse(fs.readFileSync(tsconfig, { encoding: 'utf-8' })),
		).toEqual({
			extends: '@flowr/petal/config/tsconfig.strict.json',
		});
	});
});
