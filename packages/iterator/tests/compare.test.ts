import type { LexicographicComparison } from '../src/lib/shared/_compare.ts';
import { compare } from '../src/lib/compare.ts';

describe('compare', () => {
	it('given two equal iterables then returns 0', () => {
		const result = compare([1], [1]);
		expect<LexicographicComparison>(result).toBe(0);
	});

	it('given [1] and [1, 2] then returns -1', () => {
		const result = compare([1], [1, 2]);
		expect<LexicographicComparison>(result).toBe(-1);
	});

	it('given [1, 2] and [1] then returns -1', () => {
		const result = compare([1, 2], [1]);
		expect<LexicographicComparison>(result).toBe(1);
	});

	it('given [0, 1] and [1] then returns -1', () => {
		const result = compare([0, 1], [1]);
		expect<LexicographicComparison>(result).toBe(-1);
	});

	it('given [2, 1] and [1] then returns 1', () => {
		const result = compare([2, 1], [1]);
		expect<LexicographicComparison>(result).toBe(1);
	});
});
