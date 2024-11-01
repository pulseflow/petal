import { hasAtLeastOneKeyInObject } from '../src/lib/hasAtLeastOneKeyInObject';

describe(hasAtLeastOneKeyInObject, () => {
	it('should return true if the object has at least one of the keys', () => {
		const obj = { a: 1, b: 2, c: 3 };
		expect(hasAtLeastOneKeyInObject(obj, ['a'])).toBe(true);
	});

	it('should return false if the object does not have any of the keys', () => {
		const obj = { a: 1, b: 2, c: 3 };
		expect(hasAtLeastOneKeyInObject(obj, ['d'])).toBe(false);
	});

	it('should return false if the object is nullish', () => {
		const obj = null;
		// @ts-expect-error: Testing invalid input
		expect(hasAtLeastOneKeyInObject(obj, ['a'])).toBe(false);
	});

	it('should return true if the object has the key and its value is not nullish', () => {
		const obj = { a: 1, b: null, c: undefined };
		expect(hasAtLeastOneKeyInObject(obj, ['a'])).toBe(true);
	});

	it('should return true if the object has at least one key from the array', () => {
		const obj = { a: 1, b: 2, c: 3 };
		expect(hasAtLeastOneKeyInObject(obj, ['b', 'c', 'd'])).toBe(true);
	});

	it('should return false if the object does not have any key from the array', () => {
		const obj = { a: 1, b: 2, c: 3 };
		expect(hasAtLeastOneKeyInObject(obj, ['d', 'e', 'f'])).toBe(false);
	});

	it('should return true if the object has at least one key and its value is not nullish', () => {
		const obj = { a: 1, b: null, c: undefined };
		expect(hasAtLeastOneKeyInObject(obj, ['a', 'b'])).toBe(true);
	});
});
