import { isArrayLike, isValidLength } from '../src/lib/utils/_common.ts';
import { fromUTF16, toUTF16 } from '../src/lib/utils/index.ts';

describe('utilities', () => {
	describe('toUTF16', () => {
		it('given a buffer with a single value then it returns the correct string', () => {
			const buffer = new Uint16Array([0x1]);
			expect(toUTF16(buffer)).toBe('\u{1}');
		});
	});

	describe('fromUTF16', () => {
		it('given a string with a single value then it returns the correct buffer', () => {
			const buffer = fromUTF16('\u{1}');
			expect(buffer).toEqual(new Uint16Array([0x1]));
		});
	});

	describe('isArrayLike', () => {
		it.each([undefined, null, 42, 100n, () => {}, Symbol('foo'), 'bar'])('given a non-object or null value then it returns false', (value) => {
			expect(isArrayLike(value)).toBe(false);
		});

		it('given an array then it returns true', () => {
			expect(isArrayLike([])).toBe(true);
		});

		it.each([{}, { length: '42' }])('given an object without a numeric length property then it returns false', (value) => {
			expect(isArrayLike(value)).toBe(false);
		});

		it('given an object with a numeric length property and a length of 0 then it returns true', () => {
			expect(isArrayLike({ length: 0 })).toBe(true);
		});

		it('given an object with a non-zero length and no last property then it returns false', () => {
			expect(isArrayLike({ length: 1 })).toBe(false);
		});

		it('given an object with a non-zero length and has the last property then it returns true', () => {
			expect(isArrayLike({ length: 1, 0: 'foo' })).toBe(true);
		});
	});

	describe('isValidLength', () => {
		it.each([undefined, null, 4.2, 100n, () => {}, Symbol('foo'), 'bar'])('given a non-safe integer then it returns false', (value) => {
			// @ts-expect-error: Testing invalid input
			expect(isValidLength(value)).toBe(false);
		});

		it.each([-1, 2147483648, Number.MAX_SAFE_INTEGER, Infinity, -Infinity, Number.NaN])('given an out-of-range length then it returns false', (value) => {
			expect(isValidLength(value)).toBe(false);
		});
	});
});
