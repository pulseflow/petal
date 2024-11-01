import { collectInto } from '../src/lib/collectInto.ts';

describe('collectInto', () => {
	it('given iterable with elements then returns the output array updated', () => {
		const output = [1, 2];
		const iterable = [3, 4, 5];
		const result = collectInto(iterable, output);
		expect<number[]>(result).toBe(output);
		expect<number[]>(result).toEqual([1, 2, 3, 4, 5]);
	});
});
