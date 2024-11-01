import { isEquatable } from '../src/lib/equatable';

describe('isEquatable', () => {
	it('returns true if the object is equatable', () => {
		expect(isEquatable({ equals: () => true })).toBeTruthy();
	});

	it('returns false if the object is not equatable', () => {
		expect(isEquatable({})).toBeFalsy();
		expect(isEquatable(null)).toBeFalsy();
		expect(isEquatable(undefined)).toBeFalsy();
		expect(isEquatable(1)).toBeFalsy();
		expect(isEquatable('')).toBeFalsy();
		expect(isEquatable([])).toBeFalsy();
		expect(isEquatable(() => {})).toBeFalsy();
	});
});
