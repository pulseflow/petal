import { describe, expect, it } from 'vitest';
import * as errors from './common';

describe('common', () => {
	it('extends Error properly', () => {
		const { ForwardedError: _, ...optionalCauseErrors } = { ...errors };
		for (const [name, E] of Object.entries(optionalCauseErrors)) {
			const error = new E('abcdef');
			expect(error.name).toBe(name);
			expect(error.message).toBe('abcdef');
			expect(error.toString()).toContain(name);
			expect(error.toString()).toContain('abcdef');
		}
	});

	it('supports causes', () => {
		const cause = new Error('hello');
		const { ForwardedError, ...otherErrors } = { ...errors };
		for (const [name, E] of Object.entries(otherErrors)) {
			const error = new E('abcdef', cause);
			expect(error.cause).toBe(cause);
			expect(error.toString()).toContain(
				`${name}: abcdef; caused by Error: hello`,
			);
		}

		const error = new ForwardedError('abcdef', cause);
		expect(error.cause).toBe(cause);
		expect(error.toString()).toContain(
			'Error: abcdef; caused by Error: hello',
		);
	});

	it('avoids [object Object]', () => {
		const cause = { name: 'SillyError', message: 'oh no' };
		const error = new errors.ForwardedError('abcdef', cause);
		expect(error.cause).toBe(cause);
		expect(String(error)).toBe(
			'SillyError: abcdef; caused by SillyError: oh no',
		);
	});
});
