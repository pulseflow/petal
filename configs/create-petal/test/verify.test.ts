import { describe, expect, it } from 'vitest';
import { verify } from '../src/actions/verify.js';
import { setup } from './testUtils.js';

describe('verify', () => {
	const fixture = setup();
	const exit = (code: number) => {
		throw code;
	};

	it('basics', async () => {
		const context = { template: 'basics', exit };
		await verify(context as any);
		expect(fixture.messages().length).toEqual(0);
	});

	it('missing', async () => {
		const context = { template: 'missing', exit };
		try {
			await verify(context as any);
		}
		catch (e) {}
		expect(fixture.hasMessage('template missing does not exist!')).toBe(
			false,
		);
	});
});
