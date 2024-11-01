import type { LexicographicComparison } from '../src/lib/shared/_compare';
import { compareBy } from '../src/lib/compareBy.ts';
import { defaultCompare } from '../src/lib/shared/comparators';

describe('compareBy', () => {
	it('given two equal iterables then returns 0', () => {
		const fn = vi.fn(defaultCompare);
		const result = compareBy([1], [1], fn);

		expect<LexicographicComparison>(result).toBe(0);
		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenCalledWith(1, 1);
		expect(fn).toHaveReturnedWith(0);
	});

	it('given [1] and [1, 2] then returns -1', () => {
		const fn = vi.fn(defaultCompare);
		const result = compareBy([1], [1, 2], fn);

		expect<LexicographicComparison>(result).toBe(-1);
		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenCalledWith(1, 1);
		expect(fn).toHaveReturnedWith(0);
	});

	it('given [1, 2] and [1] then returns -1', () => {
		const fn = vi.fn(defaultCompare);
		const result = compareBy([1, 2], [1], fn);

		expect<LexicographicComparison>(result).toBe(1);
		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenCalledWith(1, 1);
		expect(fn).toHaveReturnedWith(0);
	});

	describe('edge cases', () => {
		it('given [undefined] and [1] then returns 1', () => {
			const fn = vi.fn(defaultCompare);
			const result = compareBy([undefined], [1], fn);

			expect<LexicographicComparison>(result).toBe(1);
			expect(fn).not.toHaveBeenCalled();
		});

		it('given [1] and [undefined] then returns -1', () => {
			const fn = vi.fn(defaultCompare);
			const result = compareBy([1], [undefined], fn);

			expect<LexicographicComparison>(result).toBe(-1);
			expect(fn).not.toHaveBeenCalled();
		});

		it('given [undefined] and [undefined] then returns -1', () => {
			const fn = vi.fn(defaultCompare);
			const result = compareBy([undefined], [undefined], fn);

			expect<LexicographicComparison>(result).toBe(0);
			expect(fn).not.toHaveBeenCalled();
		});
	});
});
