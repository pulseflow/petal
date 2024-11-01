import { drop } from '../src';

describe('drop', () => {
	it('given iterable and count greater than zero then returns iterable with dropped elements', () => {
		const iterable = [1, 2, 3, 4, 5];
		const count = 3;
		const result = [...drop(iterable, count)];
		expect(result).toEqual([4, 5]);
	});

	it('given iterable and count equal to zero then returns original iterable', () => {
		const iterable = [1, 2, 3, 4, 5];
		const count = 0;
		const result = [...drop(iterable, count)];
		expect(result).toEqual([1, 2, 3, 4, 5]);
	});

	it('given iterable and count greater than iterable length then returns empty iterable', () => {
		const iterable = [1, 2, 3, 4, 5];
		const count = 10;
		const result = [...drop(iterable, count)];
		expect(result).toEqual([]);
	});

	it('given empty iterable then returns empty iterable', () => {
		const iterable: number[] = [];
		const count = 3;
		const result = [...drop(iterable, count)];
		expect(result).toEqual([]);
	});

	it('given negative count then throws RangeError', () => {
		const iterable = [1, 2, 3, 4, 5];
		const count = -1;
		expect(() => [...drop(iterable, count)]).toThrow(new RangeError('-1 must be a non-negative number'));
	});
});
