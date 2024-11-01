import { first } from '../src';

describe('first', () => {
	it('given non-empty iterable then returns the first element', () => {
		const iterable = [1, 2, 3];
		const result = first(iterable);
		expect(result).toBe(1);
	});

	it('given empty iterable then returns undefined', () => {
		const iterable: number[] = [];
		const result = first(iterable);
		expect(result).toBeUndefined();
	});
});
