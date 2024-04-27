import { describe, expect, it } from 'vitest';
import { CustomErrorBase, NotFoundError, assertError, isError } from '../../src/index';

const areErrors = [
	{ name: 'e', message: '' },
	new Error('e'),
	new NotFoundError(),
	Object.create({ name: 'e', message: '' }),
	Object.assign(Object.create({ name: 'e' }), {
		get message() {
			return '';
		},
	}),
	new (class extends class {
		message = '';
	} {
		name = 'e';
	})(),
	new (class SubclassError extends CustomErrorBase { })(),
	new (class SubclassError extends NotFoundError { })(),
];

const notErrors = [
	null,
	0,
	'loller',
	Symbol('lolll'),
	[],
	BigInt(0),
	false,
	true,
	{ name: 'e' },
	{ message: '' },
	{ name: '', message: 'oh no' },
	new (class { })(),
];

describe('assertError', () => {
	it.each(areErrors)('should assert that things are errors %#', (error) => {
		expect(assertError(error)).toBeUndefined();
	});

	it.each(notErrors)(
		'should assert that things are not errors %#',
		(notError) => {
			expect(() => assertError(notError)).toThrow();
		},
	);
});

describe('isError', () => {
	it.each(areErrors)('should assert that things are errors %#', (error) => {
		expect(isError(error)).toBe(true);
	});

	it.each(notErrors)(
		'should assert that things are not errors %#',
		(notError) => {
			expect(isError(notError)).toBe(false);
		},
	);
});
