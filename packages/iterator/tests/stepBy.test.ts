import { stepBy, toArray } from '../src';

describe('stepBy', () => {
	it('given [0, 1, 2, 3, 4, 5] and 2 then returns [0, 2, 4]', () => {
		const result = stepBy([0, 1, 2, 3, 4, 5], 2);
		expect<number[]>(toArray(result)).toEqual([0, 2, 4]);
	});

	it('given [0, 1] and 2 then returns [0]', () => {
		const result = stepBy([0, 1], 2);
		expect<number[]>(toArray(result)).toEqual([0]);
	});

	it('given [0] and 2 then returns [0]', () => {
		const result = stepBy([0], 2);
		expect<number[]>(toArray(result)).toEqual([0]);
	});

	it('given [] and 2 then returns [0]', () => {
		const result = stepBy([], 2);
		expect<number[]>(toArray(result)).toEqual([]);
	});
});
