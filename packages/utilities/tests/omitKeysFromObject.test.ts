import { omitKeysFromObject } from '../src/lib/omitKeysFromObject';

describe('omitKeysFromObject', () => {
	it('given object and keys then returns object without specified keys', () => {
		const source = { age: 30, city: 'New York', name: 'John' };
		const result = omitKeysFromObject(source, 'age', 'city');
		expect(result).toEqual({ name: 'John' });
	});

	it('given object and no keys then returns the same object', () => {
		const source = { age: 30, city: 'New York', name: 'John' };
		const result = omitKeysFromObject(source);
		expect(result).toEqual(source);
	});

	it('given empty object and keys then returns empty object', () => {
		const source = {};
		// @ts-expect-error: Testing invalid input
		const result = omitKeysFromObject(source, 'age', 'city');
		expect(result).toEqual({});
	});

	it('given an object with ES objects then returns object without specified keys', () => {
		const source = {
			five: new Error('testing'),
			four: new Uint8Array(),
			one: new Map(),
			seven: [],
			six: /meow/,
			three: new Date(),
			two: new Set(),
		};
		const result = omitKeysFromObject(source, 'one', 'two', 'three', 'four', 'five', 'six', 'seven');
		expect(result).toEqual({});
	});

	it('given keys as array then removes keys', () => {
		const source = { age: 30, city: 'New York', name: 'John' };
		// @ts-expect-error: spreading Arrays gives "string" instead of "keyof T"
		const result = omitKeysFromObject(source, ...['age', 'city']);
		expect(result).toEqual({ name: 'John' });
	});

	it('given any source object then validates that the result isn\'t identical to the source', () => {
		const source = { age: 30, city: 'New York', name: 'John' };
		const result = omitKeysFromObject(source);
		expect(result).not.toBe(source);
	});

	it('given any source object then validates that the source isn\'t modified', () => {
		const source = { age: 30, city: 'New York', name: 'John' };
		omitKeysFromObject(source);
		expect(source).toEqual({ age: 30, city: 'New York', name: 'John' });
	});
});
