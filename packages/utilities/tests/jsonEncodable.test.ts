import type { JSONEncodable } from '../src/lib/jsonEncodable';
import { isJSONEncodable } from '../src/lib/jsonEncodable';

class Encodable implements JSONEncodable<{
	meow: string;
}> {
	public toJSON() {
		return { meow: 'mrrp' };
	}
}

describe('isJSONEncodable', () => {
	it('returns true if the object is JSON encodable', () => {
		expect(isJSONEncodable({ toJSON: () => ({}) })).toBeTruthy();
		expect(isJSONEncodable(new Encodable())).toBeTruthy();
	});

	it('returns false if the object is not JSON encodable', () => {
		expect(isJSONEncodable({})).toBeFalsy();
		expect(isJSONEncodable(null)).toBeFalsy();
		expect(isJSONEncodable(undefined)).toBeFalsy();
		expect(isJSONEncodable(1)).toBeFalsy();
		expect(isJSONEncodable('')).toBeFalsy();
		expect(isJSONEncodable([])).toBeFalsy();
		expect(isJSONEncodable(() => {})).toBeFalsy();
	});
});
