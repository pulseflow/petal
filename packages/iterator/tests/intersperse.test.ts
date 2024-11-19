import { intersperse } from '../src/lib/intersperse.ts';
import { toArray } from '../src/lib/toArray.ts';

describe('intersperse', () => {
	it('given an iterable then returns a new iterable with the separator in between', () => {
		const iterable = [0, 1, 2];

		const result = intersperse(iterable, 100);
		expect<number[]>(toArray(result)).toEqual([0, 100, 1, 100, 2]);
	});

	it('given an iterable of strings then returns a new iterable with the separator in between', () => {
		const iterable = ['Hello', 'World', '!'];

		const result = intersperse(iterable, ', ');
		expect<string>(toArray(result).join('')).toEqual('Hello, World, !');
	});
});
