/* eslint-disable unused-imports/no-unused-vars -- vars for json primitives arent used */
import type { JsonArray, JsonObject, JsonPrimitive, JsonValue } from './json';

describe('json', () => {
	it('jsonPrimitive', () => {
		const isValid = (..._v: JsonPrimitive[]) => true;
		expect(isValid(1, 's', true, false, null)).toBe(true);

		// @ts-expect-error expected to throw an error for test
		const v1: JsonPrimitive = [];
		// @ts-expect-error expected to throw an error for test
		const v2: JsonPrimitive = {};

		expect(true).toBe(true);
	});

	it('jsonArray', () => {
		const isValid = (..._v: JsonArray[]) => true;
		expect(isValid([], [1, 's', true, false, null, {}, []])).toBe(true);

		// @ts-expect-error expected to throw an error for test
		const v1: JsonArray = 1;
		// @ts-expect-error expected to throw an error for test
		const v2: JsonArray = 's';
		// @ts-expect-error expected to throw an error for test
		const v3: JsonArray = true;
		// @ts-expect-error expected to throw an error for test
		const v4: JsonArray = false;
		// @ts-expect-error expected to throw an error for test
		const v5: JsonArray = null;
		// @ts-expect-error expected to throw an error for test
		const v6: JsonArray = {};

		expect(true).toBe(true);
	});

	it('jsonObject', () => {
		const isValid = (..._v: JsonObject[]) => true;
		expect(isValid({}, { v1: 1, v2: 's', v3: true, v4: false, v5: null, v6: {}, v7: [] })).toBe(true);

		// @ts-expect-error expected to throw an error for test
		const v1: JsonObject = 1;
		// @ts-expect-error expected to throw an error for test
		const v2: JsonObject = 's';
		// @ts-expect-error expected to throw an error for test
		const v3: JsonObject = true;
		// @ts-expect-error expected to throw an error for test
		const v4: JsonObject = false;
		// @ts-expect-error expected to throw an error for test
		const v5: JsonObject = null;
		// @ts-expect-error expected to throw an error for test
		const v6: JsonObject = [];

		expect(true).toBe(true);
	});

	it('jsonValue', () => {
		const isValid = (..._v: JsonValue[]) => true;
		expect(isValid(1, 's', true, false, null, {}, [])).toBe(true);

		expect(true).toBe(true);
	});
});
