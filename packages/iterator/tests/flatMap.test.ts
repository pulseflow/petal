import { flatMap } from '../src';

describe('flatMap', () => {
	it('given iterable and callback function then returns flattened iterable', () => {
		const iterable = [1, 2, 3];
		const callback = (element: number) => [element, element * 2];
		const result = [...flatMap(iterable, callback)];
		expect(result).toEqual([1, 2, 2, 4, 3, 6]);
	});

	it('given empty iterable then returns empty iterable', () => {
		const iterable: number[] = [];
		const callback = (element: number) => [element, element * 2];
		const result = [...flatMap(iterable, callback)];
		expect(result).toEqual([]);
	});

	it('given iterable with nested arrays then returns flattened iterable', () => {
		const iterable = [
			[1, 2],
			[3, 4],
			[5, 6],
		];
		const callback = (element: number[]) => element;
		const result = [...flatMap(iterable, callback)];
		expect(result).toEqual([1, 2, 3, 4, 5, 6]);
	});

	it('given iterable with nested arrays and callback function that returns empty arrays then returns empty iterable', () => {
		const iterable = [
			[1, 2],
			[3, 4],
			[5, 6],
		];
		const callback = () => [];
		const result = [...flatMap(iterable, callback)];
		expect(result).toEqual([]);
	});

	it('given iterable and invalid callback function then throws TypeError', () => {
		const iterable = [1, 2, 3];
		const callback = 'invalid' as any;
		expect(() => [...flatMap(iterable, callback)]).toThrow(new TypeError('invalid must be a function'));
	});
});
