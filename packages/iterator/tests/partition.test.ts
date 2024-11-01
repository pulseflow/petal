import { partition } from '../src';

describe('partition', () => {
	it('given iterable and predicate then returns partitioned iterables', () => {
		const iterable = [1, 2, 3, 4, 5];
		const predicate = vi.fn((value: number) => value % 2 === 0);
		const result = partition(iterable, predicate);

		expect(result).toHaveLength(2);
		expect(result[0]).toEqual([2, 4]);
		expect(result[1]).toEqual([1, 3, 5]);
		expect(predicate).toHaveBeenCalledTimes(5);
		expect(predicate).toHaveBeenCalledWith(1, 0);
		expect(predicate).toHaveBeenCalledWith(2, 1);
		expect(predicate).toHaveBeenCalledWith(3, 2);
		expect(predicate).toHaveBeenCalledWith(4, 3);
		expect(predicate).toHaveBeenCalledWith(5, 4);
	});

	it('given empty iterable then returns empty iterables', () => {
		const iterable: number[] = [];
		const predicate = vi.fn((value: number) => value % 2 === 0);
		const result = partition(iterable, predicate);

		expect(result).toHaveLength(2);
		expect(result[0]).toEqual([]);
		expect(result[1]).toEqual([]);
	});

	it('given iterable and always-true predicate then returns iterable and empty iterable', () => {
		const iterable = [1, 2, 3, 4, 5];
		const predicate = vi.fn(() => true);
		const result = partition(iterable, predicate);

		expect(result).toHaveLength(2);
		expect(result[0]).toEqual([1, 2, 3, 4, 5]);
		expect(result[1]).toEqual([]);
	});

	it('given iterable and always-false predicate then returns empty iterable and iterable', () => {
		const iterable = [1, 2, 3, 4, 5];
		const predicate = vi.fn(() => false);
		const result = partition(iterable, predicate);

		expect(result).toHaveLength(2);
		expect(result[0]).toEqual([]);
		expect(result[1]).toEqual([1, 2, 3, 4, 5]);
	});

	it('given iterable and invalid predicate then throws TypeError', () => {
		const iterable = [1, 2, 3, 4, 5];
		const predicate = 'invalid' as any;
		expect(() => partition(iterable, predicate)).toThrow(new TypeError('invalid must be a function'));
	});
});
