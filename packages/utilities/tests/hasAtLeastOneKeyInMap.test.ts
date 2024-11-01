import { hasAtLeastOneKeyInMap } from '../src';

const mapWithKey = new Map([
	['one', 'one'],
	['two', 'two'],
	['three', 'three'],
]);

const mapWithOutKey = new Map([
	['two', 'two'],
	['three', 'three'],
]);

describe('hasAtLeastOneKeyInMap', () => {
	it('given map and array with key then return true', () => {
		expect(hasAtLeastOneKeyInMap(mapWithKey, ['one'])).toBe(true);
	});

	it('given map and array without key then return false', () => {
		expect(hasAtLeastOneKeyInMap(mapWithKey, ['four'])).toBe(false);
	});

	it('given map without key and array with key then return false', () => {
		expect(hasAtLeastOneKeyInMap(mapWithOutKey, ['one'])).toBe(false);
	});

	it('given map without key and array without key then return false', () => {
		expect(hasAtLeastOneKeyInMap(mapWithKey, ['four'])).toBe(false);
	});
});
