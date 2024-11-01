import { peekable } from '../src';

describe('peekable', () => {
	it('given iterable with elements then returns peekable iterator', () => {
		const iterable = [1, 2, 3];
		const peekableIterator = peekable(iterable);

		expect(peekableIterator.next()).toEqual({ done: false, value: 1 });
		expect(peekableIterator.peek()).toEqual({ done: false, value: 2 });
		expect(peekableIterator.peek()).toEqual({ done: false, value: 2 });
		expect(peekableIterator.next()).toEqual({ done: false, value: 2 });
		expect(peekableIterator.next()).toEqual({ done: false, value: 3 });
		expect(peekableIterator.peek()).toEqual({ done: true, value: undefined });
		expect(peekableIterator.next()).toEqual({ done: true, value: undefined });
	});

	it('given empty iterable then returns peekable iterator with done as true', () => {
		const iterable: number[] = [];
		const peekableIterator = peekable(iterable);

		expect(peekableIterator.peek()).toEqual({ done: true, value: undefined });
		expect(peekableIterator.next()).toEqual({ done: true, value: undefined });
	});

	it('given peekable iterator then returns iterable', () => {
		const iterable = [1, 2, 3];
		const peekableIterator = peekable(iterable);

		expect([...peekableIterator]).toEqual([1, 2, 3]);
	});
});
