import { filter } from '../src';

describe('filter', () => {
	it('given iterable and callback function then returns filtered iterable', () => {
		const iterable = [1, 2, 3, 4, 5];
		const cmp = (element: number) => element % 2 === 0;
		const result = [...filter(iterable, cmp)];
		expect(result).toEqual([2, 4]);
	});

	it('given iterable and callback function then returns empty iterable if no elements match the condition', () => {
		const iterable = [1, 3, 5, 7, 9];
		const cmp = (element: number) => element % 2 === 0;
		const result = [...filter(iterable, cmp)];
		expect(result).toEqual([]);
	});

	it('given empty iterable then returns empty iterable', () => {
		const iterable: number[] = [];
		const cmp = (element: number) => element % 2 === 0;
		const result = [...filter(iterable, cmp)];
		expect(result).toEqual([]);
	});

	it('given iterable and invalid callback function then throws TypeError', () => {
		const iterable = [1, 2, 3, 4, 5];
		const cmp = 'invalid' as any;
		expect(() => [...filter(iterable, cmp)]).toThrow(new TypeError('invalid must be a function'));
	});
});
