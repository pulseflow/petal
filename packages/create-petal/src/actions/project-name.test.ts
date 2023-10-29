import { projectName } from './project-name.js';
import { setup } from '../testUtils.js';

describe('project name', async () => {
	const fixture = setup();

	it('pass in name', async () => {
		const context = { projectName: '', cwd: './foo/bar/baz', prompt: () => {} };
		await projectName(context as any);

		expect(context.cwd).toEqual('./foo/bar/baz');
		expect(context.projectName).toEqual('baz');
	});

	it('dot', async () => {
		const context = {
			projectName: '',
			cwd: '.',
			prompt: () => ({ name: 'foobar' }),
		};
		await projectName(context as any);

		expect(fixture.hasMessage('"." is not empty!')).toBe(true);
		expect(context.projectName).toEqual('foobar');
	});

	it('dot slash', async () => {
		const context = {
			projectName: '',
			cwd: './',
			prompt: () => ({ name: 'foobar' }),
		};
		await projectName(context as any);

		expect(fixture.hasMessage('"./" is not empty!')).toBe(true);
		expect(context.projectName).toEqual('foobar');
	});

	it('empty', async () => {
		const context = {
			projectName: '',
			cwd: './test/fixtures/empty',
			prompt: () => ({ name: 'foobar' }),
		};
		await projectName(context as any);

		expect(fixture.hasMessage('"./test/fixtures/empty" is not empty!')).toBe(
			false,
		);
		expect(context.projectName).toEqual('empty');
	});

	it('not empty', async () => {
		const context = {
			projectName: '',
			cwd: './test/fixtures/not-empty',
			prompt: () => ({ name: 'foobar' }),
		};
		await projectName(context as any);

		expect(
			fixture.hasMessage('"./test/fixtures/not-empty" is not empty!'),
		).toBe(true);
		expect(context.projectName).toEqual('foobar');
	});

	it('basic', async () => {
		const context = {
			projectName: '',
			cwd: '',
			prompt: () => ({ name: 'foobar' }),
		};
		await projectName(context as any);

		expect(context.cwd).toEqual('foobar');
		expect(context.projectName).toEqual('foobar');
	});

	it('blank space', async () => {
		const context = {
			projectName: '',
			cwd: '',
			prompt: () => ({ name: 'foobar  ' }),
		};
		await projectName(context as any);

		expect(context.cwd).toEqual('foobar');
		expect(context.projectName).toEqual('foobar');
	});

	it('normalize', async () => {
		const context = {
			projectName: '',
			cwd: '',
			prompt: () => ({ name: 'Invalid Name' }),
		};
		await projectName(context as any);

		expect(context.cwd).toEqual('Invalid Name');
		expect(context.projectName).toEqual('invalid-name');
	});

	it('remove leading/trailing dashes', async () => {
		const context = {
			projectName: '',
			cwd: '',
			prompt: () => ({ name: '(invalid)' }),
		};
		await projectName(context as any);

		expect(context.projectName).toEqual('invalid');
	});

	it('handles scoped packages', async () => {
		const context = {
			projectName: '',
			cwd: '',
			prompt: () => ({ name: '@petal/site' }),
		};
		await projectName(context as any);

		expect(context.cwd).toEqual('@petal/site');
		expect(context.projectName).toEqual('@petal/site');
	});

	it('--yes', async () => {
		const context = {
			projectName: '',
			cwd: './foo/bar/baz',
			yes: true,
			prompt: () => {},
		};
		await projectName(context as any);
		expect(context.projectName).toEqual('baz');
	});

	it('dry run with name', async () => {
		const context = {
			projectName: '',
			cwd: './foo/bar/baz',
			dryRun: true,
			prompt: () => {},
		};
		await projectName(context as any);
		expect(context.projectName).toEqual('baz');
	});

	it('dry run with dot', async () => {
		const context = {
			projectName: '',
			cwd: '.',
			dryRun: true,
			prompt: () => ({ name: 'foobar' }),
		};
		await projectName(context as any);
		expect(context.projectName).toEqual('foobar');
	});

	it('dry run with empty', async () => {
		const context = {
			projectName: '',
			cwd: './test/fixtures/empty',
			dryRun: true,
			prompt: () => ({ name: 'foobar' }),
		};
		await projectName(context as any);
		expect(context.projectName).toEqual('empty');
	});
});
