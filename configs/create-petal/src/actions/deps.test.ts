import { setup } from '../testUtils.js';
import { dependencies } from './deps.js';

describe('deps', () => {
	const fixture = setup();

	it('--yes', async () => {
		const context = {
			cwd: '',
			yes: true,
			packageManager: 'npm',
			dryRun: true,
			prompt: () => ({ deps: true }),
		};
		await dependencies(context as any);
		expect(fixture.hasMessage('Skipping dependency installation')).toBe(
			true,
		);
	});

	it('prompt yes', async () => {
		const context = {
			cwd: '',
			packageManager: 'npm',
			dryRun: true,
			prompt: () => ({ deps: true }),
			install: undefined,
		};
		await dependencies(context as any);
		expect(fixture.hasMessage('Skipping dependency installation')).toBe(
			true,
		);
		expect(context.install).toEqual(true);
	});

	it('prompt no', async () => {
		const context = {
			cwd: '',
			packageManager: 'npm',
			dryRun: true,
			prompt: () => ({ deps: false }),
			install: undefined,
		};
		await dependencies(context as any);
		expect(fixture.hasMessage('Skipping dependency installation')).toBe(
			true,
		);
		expect(context.install).toEqual(false);
	});

	it('--install', async () => {
		const context = {
			cwd: '',
			install: true,
			packageManager: 'npm',
			dryRun: true,
			prompt: () => ({ deps: false }),
		};
		await dependencies(context as any);
		expect(fixture.hasMessage('Skipping dependency installation')).toBe(
			true,
		);
		expect(context.install).toEqual(true);
	});

	it('--no-install', async () => {
		const context = {
			cwd: '',
			install: false,
			packageManager: 'npm',
			dryRun: true,
			prompt: () => ({ deps: false }),
		};
		await dependencies(context as any);
		expect(fixture.hasMessage('Skipping dependency installation')).toBe(
			true,
		);
		expect(context.install).toEqual(false);
	});
});
