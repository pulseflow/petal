import { Buffer } from 'node:buffer';
import { deepClone } from '../src';

describe('deepClone', () => {
	it('given null then returns same', () => {
		const source = null;
		expect(deepClone(source)).toEqual(source);
	});

	it('given string then returns same', () => {
		const source = 'Hello';
		expect(deepClone(source)).toEqual(source);
	});

	it('given number then returns same', () => {
		const source = 420;
		expect(deepClone(source)).toEqual(source);
	});

	it('given BigInt then returns same', () => {
		const source = BigInt(420);
		expect(deepClone(source)).toEqual(source);
	});

	it('given boolean then returns same', () => {
		const source = true;
		expect(deepClone(source)).toEqual(source);
	});

	it('given Symbol then returns same', () => {
		const source: unique symbol = Symbol('flowr');
		expect(deepClone(source)).toBe(source);
	});

	it('given function then returns same', () => {
		const source = function () { /* noop */ };
		expect(deepClone(source)).toBe(source);
	});

	it.each([
		['Buffer', Buffer],
		['Uint8Array', Uint8Array],
		['Uint8ClampedArray', Uint8ClampedArray],
		['Uint16Array', Uint16Array],
		['Uint32Array', Uint32Array],
		['Int8Array', Int8Array],
		['Int16Array', Int16Array],
		['Int32Array', Int32Array],
		['Float32Array', Float32Array],
		['Float64Array', Float64Array],
	])('given %s then returns same', (_, TypedArray) => {
		const source = TypedArray.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
		const result = deepClone(source);

		expect(result).toEqual(source);
		expect(result).toBeInstanceOf(TypedArray);
	});

	it.each([
		['BigUint64Array', BigUint64Array],
		['BigInt64Array', BigInt64Array],
	])('given %s then returns same', (_, TypedArray) => {
		const source = TypedArray.from([0x62n, 0x75n, 0x66n, 0x66n, 0x65n, 0x72n]);
		const result = deepClone(source);

		expect(result).toEqual(source);
		expect(result).toBeInstanceOf(TypedArray);
	});

	it('given Array then returns same', () => {
		expect.assertions(2);
		const source = [1, 2, 3];
		const clone = deepClone(source);

		expect(source).not.toBe(clone);
		expect(clone).toEqual(source);
	});

	it('given nested array then returns new clone', () => {
		expect.assertions(4);
		const source: [number, number, number, Array<number | number[]>] = [1, 2, 3, [4, 5, [6, 7, 8]]];
		const clone = deepClone(source);

		expect(source).not.toBe(clone);
		expect(source[3]).not.toBe(clone[3]);
		expect(source[3][2]).not.toBe(clone[3][2]);
		expect(clone).toEqual(source);
	});

	it('given object then returns new clone', () => {
		expect.assertions(2);
		const source = { a: 1, b: 2 };
		const clone = deepClone(source);

		expect(source).not.toBe(clone);
		expect(clone).toEqual(source);
	});

	it('given nested object then returns new object', () => {
		expect.assertions(4);
		const source = { ab: 1, cd: 2, ef: { gh: 3, ij: 4, kl: [1] } };
		const clone = deepClone(source);

		expect(source).not.toBe(clone);
		expect(source.ef).not.toBe(clone.ef);
		expect(source.ef.kl).not.toBe(clone.ef.kl);
		expect(clone).toEqual(source);
	});

	it('given map then returns new map', () => {
		expect.assertions(5);
		const source = new Map().set('Hello', 420).set('World', 'Yay!');
		const cloned = deepClone(source);

		expect(cloned instanceof Map).toBe(true);
		expect(source).not.toBe(cloned);
		expect(cloned.size).toBe(2);
		expect(cloned.get('Hello')).toBe(420);
		expect(cloned.get('World')).toBe('Yay!');
	});

	it('given set then returns new set', () => {
		expect.assertions(5);
		const source = new Set().add('Hello').add('World');
		const cloned = deepClone(source);

		expect(cloned instanceof Set).toBe(true);
		expect(source).not.toBe(cloned);
		expect(cloned.size).toBe(2);
		expect(cloned.has('Hello')).toBe(true);
		expect(cloned.has('World')).toBe(true);
	});

	it('given date then returns same date', () => {
		expect.assertions(2);
		const source = new Date('1995-02-21T12:45:00.000Z');
		const clone = deepClone(source);

		expect(source).not.toBe(clone);
		expect(clone).toEqual(source);
	});

	it('given date in object then returns same date', () => {
		expect.assertions(2);
		const source = { dateTime: new Date('1995-02-21T12:45:00.000Z') };
		const clone = deepClone(source);

		expect(source).not.toBe(clone);
		expect(clone).toEqual(source);
	});
});
