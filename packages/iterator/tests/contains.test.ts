import { contains } from '../src';

describe('contains', () => {
	it('given iterable containing the value then returns true', () => {
		const iterable = [1, 2, 3];
		const value = 2;
		const result = contains(iterable, value);
		expect(result).toBe(true);
	});

	it('given iterable not containing the value then returns false', () => {
		const iterable = [1, 2, 3];
		const value = 4;
		const result = contains(iterable, value);
		expect(result).toBe(false);
	});

	it('given empty iterable then returns false', () => {
		const iterable: number[] = [];
		const value = 1;
		const result = contains(iterable, value);
		expect(result).toBe(false);
	});
});
