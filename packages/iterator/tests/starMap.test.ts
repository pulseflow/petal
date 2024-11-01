import { starMap } from '../src';

describe('starMap', () => {
	it('given iterable and callback function then returns mapped iterable', () => {
		const iterable = [
			[1, 2],
			[3, 4],
			[5, 6],
		] as Array<[number, number]>;
		const cmp = vi.fn((a: number, b: number) => a + b);
		const result = [...starMap(iterable, cmp)];

		expect<number[]>(result).toEqual([3, 7, 11]);
		expect(cmp).toHaveBeenCalledTimes(3);
		expect(cmp).toHaveBeenCalledWith(1, 2);
		expect(cmp).toHaveBeenCalledWith(3, 4);
		expect(cmp).toHaveBeenCalledWith(5, 6);
	});

	it('given empty iterable then returns empty iterable', () => {
		const iterable = [] as Array<[number, number]>;
		const cmp = vi.fn((a: number, b: number) => a + b);
		const result = [...starMap(iterable, cmp)];

		expect<number[]>(result).toEqual([]);
		expect(cmp).not.toHaveBeenCalled();
	});

	it('given iterable with mixed types then resolves types correctly', () => {
		const iterable = [
			[1, 'foo'],
			[2, 'bar'],
			[3, 'baz'],
		] as Array<[number, string]>;
		const cmp = vi.fn((a: number, b: string) => b.repeat(a));
		const result = [...starMap(iterable, cmp)];

		expect<string[]>(result).toEqual(['foo', 'barbar', 'bazbazbaz']);
		expect(cmp).toHaveBeenCalledTimes(3);
	});

	it('given iterable with iterables then returns mapped iterable', () => {
		const iterable = [[1, 2].values(), [3, 4].values(), [5, 6].values()];
		const cmp = vi.fn((a: number, b: number) => a + b);
		const result = [...starMap(iterable, cmp)];

		expect<number[]>(result).toEqual([3, 7, 11]);
		expect(cmp).toHaveBeenCalledTimes(3);
	});

	it('given iterable with non-iterable values then throws TypeError', () => {
		const iterable = [[1, 2], [3, 4], 5] as Array<[number, number]>;
		const cmp = vi.fn((a: number, b: number) => a + b);

		expect(() => [...starMap(iterable, cmp)]).toThrow(new TypeError('5 cannot be converted to an iterable'));
		expect(cmp).toHaveBeenCalledTimes(2);
		expect(cmp).toHaveBeenCalledWith(1, 2);
		expect(cmp).toHaveBeenCalledWith(3, 4);
	});

	it('given iterable and invalid callback function then throws TypeError', () => {
		const iterable = [
			[1, 2],
			[3, 4],
		] as Array<[number, number]>;
		const cmp = 'invalid' as any;
		expect(() => [...starMap(iterable, cmp)]).toThrow(new TypeError('invalid must be a function'));
	});
});
