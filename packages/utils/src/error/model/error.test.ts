import { deserializeError, NotModifiedError, serializeError, stringifyError } from '../../index';

class CustomError extends Error {
	readonly customField: any;
	constructor(message: string) {
		super(message);
		this.name = 'CustomError';
		this.customField = { complex: 'data' };
	}
}

describe('serialization', () => {
	it('runs the happy path with stack', () => {
		const before = new CustomError('m');
		const after = deserializeError<CustomError>(
			serializeError(before, { includeStack: true }),
		);
		expect(after.message).toEqual(before.message);
		expect(after.name).toEqual(before.name);
		expect(after.stack).toEqual(before.stack);
		expect(after.customField).toEqual(before.customField);
		// Does not reconstruct the actual class!
		expect(after.constructor).not.toBe(before.constructor);
	});

	it('runs the happy path without stack', () => {
		const before = new CustomError('m');
		const after = deserializeError<CustomError>(
			serializeError(before, { includeStack: false }),
		);
		expect(after.message).toEqual(before.message);
		expect(after.name).toEqual(before.name);
		expect(after.stack).not.toEqual(before.stack);
		expect(after.customField).toEqual(before.customField);
		// Does not reconstruct the actual class!
		expect(after.constructor).not.toBe(before.constructor);
	});

	it('serializes stack traces only when allowed', () => {
		const before = new CustomError('m');
		const withStack = serializeError(before, { includeStack: true });
		const withoutStack1 = serializeError(before, { includeStack: false });
		const withoutStack2 = serializeError(before);
		expect(withStack.stack).toEqual(before.stack);
		expect(withoutStack1.stack).not.toBeDefined();
		expect(withoutStack2.stack).not.toBeDefined();
	});

	it('stringifies all supported forms', () => {
		expect(stringifyError({})).toEqual('unknown error \'[object Object]\'');
		expect(
			stringifyError({
				toString() {
					return 'str';
				},
			}),
		).toEqual('unknown error \'str\'');
		expect(
			stringifyError({
				name: 'not used',
				message: 'not used',
				toString() {
					return 'str';
				},
			}),
		).toEqual('str');
		expect(stringifyError({ name: 'N', message: 'm1' })).toEqual('N: m1');
		expect(stringifyError(new NotModifiedError('m2'))).toEqual(
			'NotModifiedError: m2',
		);
		expect(stringifyError(new Error('m3'))).toEqual('Error: m3');
		expect(stringifyError(new TypeError('m4'))).toEqual('TypeError: m4');
	});
});
