import { ascString, defaultCompare, descString, isSortedBy } from '../src';

describe('isSortedBy', () => {
	it('given iterable with values in ascending order with a asc function then returns true', () => {
		const comparator = vi.fn(ascString);
		const iterable = [1, 2, 2, 9];

		const result = isSortedBy(iterable, comparator);
		expect(result).toBe(true);
		expect(comparator).toHaveBeenCalledTimes(3);

		// asc(1, 2) = -1
		expect(comparator).toHaveBeenNthCalledWith(1, 1, 2);
		expect(comparator).toHaveNthReturnedWith(1, -1);

		// asc(2, 2) = 0
		expect(comparator).toHaveBeenNthCalledWith(2, 2, 2);
		expect(comparator).toHaveNthReturnedWith(2, 0);

		// asc(2, 9) = -1
		expect(comparator).toHaveBeenNthCalledWith(3, 2, 9);
		expect(comparator).toHaveNthReturnedWith(3, -1);
	});

	it('given iterable with values in descending order with a desc function then returns true', () => {
		const comparator = vi.fn(descString);
		const iterable = [9, 2, 2, 1];

		const result = isSortedBy(iterable, comparator);
		expect(result).toBe(true);
		expect(comparator).toHaveBeenCalledTimes(3);

		// desc(9, 2) = 1
		expect(comparator).toHaveBeenNthCalledWith(1, 9, 2);
		expect(comparator).toHaveNthReturnedWith(1, -1);

		// desc(2, 2) = 0
		expect(comparator).toHaveBeenNthCalledWith(2, 2, 2);
		expect(comparator).toHaveNthReturnedWith(2, 0);

		// desc(2, 1) = 1
		expect(comparator).toHaveBeenNthCalledWith(3, 2, 1);
		expect(comparator).toHaveNthReturnedWith(3, -1);
	});

	it('given an iterable with one value then returns true', () => {
		const comparator = vi.fn(defaultCompare);
		const iterable = [0];

		const result = isSortedBy(iterable, comparator);
		expect(result).toBe(true);
		expect(comparator).not.toHaveBeenCalled();
	});

	it('given an empty iterable then returns true', () => {
		const comparator = vi.fn(defaultCompare);
		const iterable: number[] = [];

		const result = isSortedBy(iterable, comparator);
		expect(result).toBe(true);
		expect(comparator).not.toHaveBeenCalled();
	});
});
