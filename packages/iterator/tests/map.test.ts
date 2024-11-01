import { map } from '../src';

describe('map', () => {
	it('given iterable and callback function then returns mapped iterable', () => {
		const iterable = [1, 2, 3];
		const cmp = (element: number) => element * 2;
		const result = [...map(iterable, cmp)];
		expect(result).toEqual([2, 4, 6]);
	});

	it('given empty iterable then returns empty iterable', () => {
		const iterable: number[] = [];
		const cmp = (element: number) => element * 2;
		const result = [...map(iterable, cmp)];
		expect(result).toEqual([]);
	});

	it('given iterable and callback function with index then returns mapped iterable with index', () => {
		const iterable = [1, 2, 3];
		const cmp = (element: number, index: number) => element + index;
		const result = [...map(iterable, cmp)];
		expect(result).toEqual([1, 3, 5]);
	});

	it('given iterable and invalid callback function then throws TypeError', () => {
		const iterable = [1, 2, 3];
		const cmp = 'invalid' as any;
		expect(() => [...map(iterable, cmp)]).toThrow(new TypeError('invalid must be a function'));
	});
});
