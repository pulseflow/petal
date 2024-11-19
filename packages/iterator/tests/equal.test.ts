import { equal } from '../src/lib/equal.ts';

describe('equal', () => {
	it('given two equal iterables then returns true', () => {
		const result = equal([1], [1]);
		expect<boolean>(result).toBe(true);
	});

	it('given [1] and [1, 2] then returns false', () => {
		const result = equal([1], [1, 2]);
		expect<boolean>(result).toBe(false);
	});

	it('given [1, 2] and [1] then returns false', () => {
		const result = equal([1, 2], [1]);
		expect<boolean>(result).toBe(false);
	});
});
