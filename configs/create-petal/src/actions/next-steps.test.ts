import { describe, expect, it } from 'vitest';
import { setup } from '../testUtils.js';
import { next } from './next-steps.js';

describe('next steps', () => {
	const fixture = setup();

	it('no arguments', async () => {
		await next({
			skipFlower: false,
			cwd: './it/fixtures/not-empty',
			packageManager: 'npm',
		});
		expect(fixture.hasMessage('npm run dev')).toBe(true);
		expect(fixture.hasMessage('good luck out there!')).toBe(true);
	});

	it('--skip-flower', async () => {
		await next({
			skipFlower: true,
			cwd: './it/fixtures/not-empty',
			packageManager: 'npm',
		});
		expect(fixture.hasMessage('good luck out there!')).toBe(false);
	});
});