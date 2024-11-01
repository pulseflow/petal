import { reduce } from '../src';

describe('reduce', () => {
	it('given iterable and callback function then returns reduced value', () => {
		const iterable = [1, 2, 3, 4, 5];
		const cmp = vi.fn((accumulator: number, currentValue: number) => accumulator + currentValue);
		const result = reduce(iterable, cmp);

		expect(result).toEqual(15);
		expect(cmp).toHaveBeenCalledTimes(4);
		expect(cmp).toHaveBeenCalledWith(1, 2, 1);
		expect(cmp).toHaveBeenCalledWith(3, 3, 2);
		expect(cmp).toHaveBeenCalledWith(6, 4, 3);
		expect(cmp).toHaveBeenCalledWith(10, 5, 4);
	});

	it('given iterable, callback function, and initial value then returns reduced value', () => {
		const iterable = [1, 2, 3, 4, 5];
		const cmp = vi.fn((accumulator: number, currentValue: number) => accumulator + currentValue);
		const initialValue = 10;
		const result = reduce(iterable, cmp, initialValue);

		expect(result).toEqual(25);
		expect(cmp).toHaveBeenCalledTimes(5);
		expect(cmp).toHaveBeenCalledWith(10, 1, 0);
		expect(cmp).toHaveBeenCalledWith(11, 2, 1);
		expect(cmp).toHaveBeenCalledWith(13, 3, 2);
		expect(cmp).toHaveBeenCalledWith(16, 4, 3);
		expect(cmp).toHaveBeenCalledWith(20, 5, 4);
	});

	it('given empty iterable and no initial value then throws TypeError', () => {
		const iterable: number[] = [];
		const cmp = vi.fn((accumulator: number, currentValue: number) => accumulator + currentValue);

		expect(() => reduce(iterable, cmp)).toThrow(new TypeError('Reduce of empty iterator with no initial value'));
		expect(cmp).not.toHaveBeenCalled();
	});

	it('given empty iterable and initial value then returns initial value', () => {
		const iterable: number[] = [];
		const cmp = vi.fn((accumulator: number, currentValue: number) => accumulator + currentValue);
		const initialValue = 10;
		const result = reduce(iterable, cmp, initialValue);

		expect(result).toEqual(10);
		expect(cmp).not.toHaveBeenCalled();
	});

	it('given iterable and invalid callback function then throws TypeError', () => {
		const iterable = [1, 2, 3, 4, 5];
		const cmp = 'invalid' as any;

		expect(() => reduce(iterable, cmp)).toThrow(new TypeError('invalid must be a function'));
	});
});
