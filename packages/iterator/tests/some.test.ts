import { some } from '../src';

describe('some', () => {
	it('given iterable and callback function that returns true for some elements then returns true', () => {
		const iterable = [1, 2, 3, 4, 5];
		const cmp = vi.fn((element: number) => element % 2 === 0);
		const result = some(iterable, cmp);

		expect(result).toBe(true);
		expect(cmp).toHaveBeenCalledTimes(2);
		expect(cmp).toHaveBeenCalledWith(1, 0);
		expect(cmp).toHaveBeenCalledWith(2, 1);
	});

	it('given iterable and callback function that returns false for all elements then returns false', () => {
		const iterable = [1, 3, 5, 7, 9];
		const cmp = vi.fn((element: number) => element % 2 === 0);
		const result = some(iterable, cmp);

		expect(result).toBe(false);
		expect(cmp).toHaveBeenCalledTimes(5);
		expect(cmp).toHaveBeenCalledWith(1, 0);
		expect(cmp).toHaveBeenCalledWith(3, 1);
		expect(cmp).toHaveBeenCalledWith(5, 2);
		expect(cmp).toHaveBeenCalledWith(7, 3);
		expect(cmp).toHaveBeenCalledWith(9, 4);
	});

	it('given empty iterable then returns false', () => {
		const iterable: number[] = [];
		const cmp = vi.fn((element: number) => element % 2 === 0);
		const result = some(iterable, cmp);

		expect(result).toBe(false);
		expect(cmp).not.toHaveBeenCalled();
	});

	it('given iterable and invalid callback function then throws TypeError', () => {
		const iterable = [1, 2, 3];
		const cmp = 'invalid' as any;
		expect(() => some(iterable, cmp)).toThrow(new TypeError('invalid must be a function'));
	});
});
