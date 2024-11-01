import { toIterableIterator } from '../src';

describe('toIterableIterator', () => {
	it('given an array then returns an iterable iterator', () => {
		const iterable = [1, 2, 3];
		const iterator = toIterableIterator(iterable);
		expect([...iterator]).toEqual([1, 2, 3]);
	});

	it('given a string then returns an iterable iterator', () => {
		const iterable = 'hello';
		const iterator = toIterableIterator(iterable);
		expect([...iterator]).toEqual(['h', 'e', 'l', 'l', 'o']);
	});

	it('given a Set then returns an iterable iterator', () => {
		const iterable = new Set([1, 2, 3]);
		const iterator = toIterableIterator(iterable);
		expect([...iterator]).toEqual([1, 2, 3]);
	});

	it('given a Map then returns an iterable iterator', () => {
		const iterable = new Map([
			['key1', 'value1'],
			['key2', 'value2'],
		]);
		const iterator = toIterableIterator(iterable);
		expect([...iterator]).toEqual([
			['key1', 'value1'],
			['key2', 'value2'],
		]);
	});

	it('given an empty iterable then returns an empty iterable iterator', () => {
		const iterable: number[] = [];
		const iterator = toIterableIterator(iterable);
		expect([...iterator]).toEqual([]);
	});

	it('given an iterator then returns an iterable iterator', () => {
		const obj = {
			counter: 0,
			next() {
				return this.counter >= 3 ? { done: true, value: undefined } : { done: false, value: this.counter++ };
			},
		};
		const iterator = toIterableIterator(obj);
		expect([...iterator]).toEqual([0, 1, 2]);
	});
});
