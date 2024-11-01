import { zip } from '../src';

describe('zip', () => {
	it('given multiple iterables with same length then returns zipped iterable', () => {
		const iterable1 = [1, 2, 3];
		const iterable2 = ['a', 'b', 'c'];
		const iterable3 = [true, false, true];
		const result = [...zip(iterable1, iterable2, iterable3)];
		expect<Array<[number, string, boolean]>>(result).toEqual([
			[1, 'a', true],
			[2, 'b', false],
			[3, 'c', true],
		]);
	});

	it('given multiple iterables with different lengths then returns zipped iterable up to shortest length', () => {
		const iterable1 = [1, 2, 3];
		const iterable2 = ['a', 'b'];
		const iterable3 = [true, false, true, false];
		const result = [...zip(iterable1, iterable2, iterable3)];
		expect<Array<[number, string, boolean]>>(result).toEqual([
			[1, 'a', true],
			[2, 'b', false],
		]);
	});

	it('given empty iterables then returns empty iterable', () => {
		const iterable1: number[] = [];
		const iterable2: string[] = [];
		const iterable3: boolean[] = [];
		const result = [...zip(iterable1, iterable2, iterable3)];
		expect<Array<[number, string, boolean]>>(result).toEqual([]);
	});
});
