import { dropWhile } from '../src';

describe('dropWhile', () => {
	it('given iterable and callback function then returns iterable with dropped elements', () => {
		const iterable = [1, 2, 3, 4, 5];
		const cmp = (element: number) => element < 3;
		const result = [...dropWhile(iterable, cmp)];
		expect(result).toEqual([3, 4, 5]);
	});

	it('given empty iterable then returns empty iterable', () => {
		const iterable: number[] = [];
		const cmp = (element: number) => element < 3;
		const result = [...dropWhile(iterable, cmp)];
		expect(result).toEqual([]);
	});

	it('given iterable and callback function that always returns true then returns empty iterable', () => {
		const iterable = [1, 2, 3, 4, 5];
		const cmp = () => true;
		const result = [...dropWhile(iterable, cmp)];
		expect(result).toEqual([]);
	});

	it('given iterable and callback function that always returns false then returns original iterable', () => {
		const iterable = [1, 2, 3, 4, 5];
		const cmp = () => false;
		const result = [...dropWhile(iterable, cmp)];
		expect(result).toEqual(iterable);
	});

	it('given iterable and invalid callback function then throws TypeError', () => {
		const iterable = [1, 2, 3, 4, 5];
		const cmp = 'invalid' as any;
		expect(() => [...dropWhile(iterable, cmp)]).toThrow(new TypeError('invalid must be a function'));
	});
});
