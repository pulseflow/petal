import { empty } from '../src';

describe('empty', () => {
	it('given empty iterable then returns an empty iterable', () => {
		const result = [...empty()];
		expect<never[]>(result).toEqual([]);
	});

	it('given empty iterable with specified element number then returns an empty iterable of that number type', () => {
		const result = [...empty<number>()];
		expect<number[]>(result).toEqual([]);
	});

	it('given empty iterable with specified element string type then returns an empty iterable of that string type', () => {
		const result = [...empty<string>()];
		expect<string[]>(result).toEqual([]);
	});
});
