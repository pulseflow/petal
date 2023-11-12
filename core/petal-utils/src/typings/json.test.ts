import { JsonPrimitive, JsonArray, JsonObject, JsonValue } from './json.js';

describe('json', () => {
	it('JsonPrimitive', () => {
		function isValid(..._v: JsonPrimitive[]) {}
		isValid(1, 's', true, false, null);

		// @ts-expect-error
		const v1: JsonPrimitive = [];
		// @ts-expect-error
		const v2: JsonPrimitive = {};

		expect(true).toBe(true);
	});

	it('JsonArray', () => {
		function isValid(..._v: JsonArray[]) {}
		isValid([], [1, 's', true, false, null, {}, []]);

		// @ts-expect-error
		const v1: JsonArray = 1;
		// @ts-expect-error
		const v2: JsonArray = 's';
		// @ts-expect-error
		const v3: JsonArray = true;
		// @ts-expect-error
		const v4: JsonArray = false;
		// @ts-expect-error
		const v5: JsonArray = null;
		// @ts-expect-error
		const v6: JsonArray = {};

		expect(true).toBe(true);
	});

	it('JsonObject', () => {
		function isValid(..._v: JsonObject[]) {}
		isValid(
			{},
			{ v1: 1, v2: 's', v3: true, v4: false, v5: null, v6: {}, v7: [] },
		);

		// @ts-expect-error
		const v1: JsonObject = 1;
		// @ts-expect-error
		const v2: JsonObject = 's';
		// @ts-expect-error
		const v3: JsonObject = true;
		// @ts-expect-error
		const v4: JsonObject = false;
		// @ts-expect-error
		const v5: JsonObject = null;
		// @ts-expect-error
		const v6: JsonObject = [];

		expect(true).toBe(true);
	});

	it('JsonValue', () => {
		function isValid(..._v: JsonValue[]) {}
		isValid(1, 's', true, false, null, {}, []);

		expect(true).toBe(true);
	});
});
