import { lessThan } from '../src';

describe('lessOrEqualThan', () => {
	it('given two equal iterables then returns false', () => {
		const result = lessThan([1], [1]);
		expect<boolean>(result).toBe(false);
	});

	it('given [1] and [1, 2] then returns true', () => {
		const result = lessThan([1], [1, 2]);
		expect<boolean>(result).toBe(true);
	});

	it('given [1, 2] and [1] then returns false', () => {
		const result = lessThan([1, 2], [1]);
		expect<boolean>(result).toBe(false);
	});

	it('given [1, 2] and [1, 2] then returns false', () => {
		const result = lessThan([1, 2], [1, 2]);
		expect<boolean>(result).toBe(false);
	});
});
