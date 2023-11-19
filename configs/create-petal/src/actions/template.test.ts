import { setup } from '../testUtils.js';
import { template } from './template.js';

describe('template', () => {
	const fixture = setup();

	it('none', async () => {
		const context = {
			template: '',
			cwd: '',
			dryRun: true,
			prompt: () => ({ template: 'blog' }),
		};
		await template(context as any);

		expect(fixture.hasMessage('skipping template copying')).toBe(true);
		expect(context.template).toEqual('blog');
	});

	it('minimal (--dry-run)', async () => {
		const context = {
			template: 'minimal',
			cwd: '',
			dryRun: true,
			prompt: () => {},
		};
		await template(context as any);
		expect(fixture.hasMessage('using minimal as project template')).toBe(
			true,
		);
	});

	it('basics (--dry-run)', async () => {
		const context = {
			template: 'basics',
			cwd: '',
			dryRun: true,
			prompt: () => {},
		};
		await template(context as any);

		expect(fixture.hasMessage('using basics as project template')).toBe(
			true,
		);
	});

	it('blog (--dry-run)', async () => {
		const context = {
			template: 'blog',
			cwd: '',
			dryRun: true,
			prompt: () => {},
		};
		await template(context as any);

		expect(fixture.hasMessage('using blog as project template')).toBe(true);
	});

	it('minimal (--yes)', async () => {
		const context = {
			template: 'minimal',
			cwd: '',
			dryRun: true,
			yes: true,
			prompt: () => {},
		};
		await template(context as any);

		expect(fixture.hasMessage('using minimal as project template')).toBe(
			true,
		);
	});
});
