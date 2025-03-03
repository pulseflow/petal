import { from } from '../src';

describe('from', () => {
	it('given an array then returns an iterable with the same elements', () => {
		const array = [1, 2, 3];
		const result = from(array);
		expect(result.next()).toStrictEqual({ done: false, value: 1 });
		expect(result.next()).toStrictEqual({ done: false, value: 2 });
		expect(result.next()).toStrictEqual({ done: false, value: 3 });
		expect(result.next()).toStrictEqual({ done: true, value: undefined });
	});

	it('given a string then returns an iterable with each character as an element', () => {
		const str = 'hello';
		const result = from(str);
		expect(result.next()).toStrictEqual({ done: false, value: 'h' });
		expect(result.next()).toStrictEqual({ done: false, value: 'e' });
		expect(result.next()).toStrictEqual({ done: false, value: 'l' });
		expect(result.next()).toStrictEqual({ done: false, value: 'l' });
		expect(result.next()).toStrictEqual({ done: false, value: 'o' });
		expect(result.next()).toStrictEqual({ done: true, value: undefined });
	});

	it('given a Set then returns an iterable with the same elements', () => {
		const set = new Set([1, 2, 3]);
		const result = from(set);
		expect(result.next()).toStrictEqual({ done: false, value: 1 });
		expect(result.next()).toStrictEqual({ done: false, value: 2 });
		expect(result.next()).toStrictEqual({ done: false, value: 3 });
		expect(result.next()).toStrictEqual({ done: true, value: undefined });
	});

	it('given a Map then returns an iterable with the same elements', () => {
		const map = new Map([
			['a', 1],
			['b', 2],
			['c', 3],
		]);
		const result = from(map);
		expect(result.next()).toStrictEqual({ done: false, value: ['a', 1] });
		expect(result.next()).toStrictEqual({ done: false, value: ['b', 2] });
		expect(result.next()).toStrictEqual({ done: false, value: ['c', 3] });
		expect(result.next()).toStrictEqual({ done: true, value: undefined });
	});

	it('given an empty iterable then returns an empty iterable', () => {
		const result = from([]);
		expect(result.next()).toStrictEqual({ done: true, value: undefined });
	});

	it('given an object with iterable values then returns an iterable with the same elements', () => {
		const obj = {
			* [Symbol.iterator]() {
				yield 1;
				yield 2;
				yield 3;
			},
		};
		const result = from(obj);
		expect(result.next()).toStrictEqual({ done: false, value: 1 });
		expect(result.next()).toStrictEqual({ done: false, value: 2 });
		expect(result.next()).toStrictEqual({ done: false, value: 3 });
		expect(result.next()).toStrictEqual({ done: true, value: undefined });
	});

	it('given an iterator object then returns an iterable with the same elements', () => {
		const obj = {
			counter: 0,
			next() {
				return this.counter >= 3 ? { done: true, value: undefined } : { done: false, value: this.counter++ };
			},
		};
		const result = from(obj);
		expect(result).toBe(obj);
		expect(result.next()).toStrictEqual({ done: false, value: 0 });
		expect(result.next()).toStrictEqual({ done: false, value: 1 });
		expect(result.next()).toStrictEqual({ done: false, value: 2 });
		expect(result.next()).toStrictEqual({ done: true, value: undefined });
	});

	it('given an object with non-iterable values then throws TypeError', () => {
		const obj = { a: 1, b: 2, c: 3 };
		// @ts-expect-error: Testing invalid input
		expect(() => from(obj)).toThrow(new TypeError('[object Object] cannot be converted to an iterable'));
	});

	it('given a null object then throws TypeError', () => {
		const obj = null;
		// @ts-expect-error: Testing invalid input
		expect(() => from(obj)).toThrow(new TypeError('null cannot be converted to an iterable'));
	});

	it('given an invalid input then throws TypeError', () => {
		// @ts-expect-error: Testing invalid input
		expect(() => from(1)).toThrow(new TypeError('1 cannot be converted to an iterable'));
	});
});
