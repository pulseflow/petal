import { objectEntries } from '../src';

describe('objectEntries', () => {
	it('given basic readonly then returns expected', () => {
		const source = { a: 'Hello', b: 420 } as const;
		const expected = [
			['a', 'Hello'],
			['b', 420],
		];

		expect<Array<['a' | 'b', 'Hello' | 420]>>(objectEntries(source)).toEqual(expected);
	});

	it('given deep readonly then returns expected', () => {
		const source = { a: 'Hello', b: 420, deep: { i: [] } } as const;
		const expected = [
			['a', 'Hello'],
			['b', 420],
			['deep', { i: [] }],
		];

		expect<Array<['a' | 'b' | 'deep', 'Hello' | 420 | { i: readonly [] }]>>(objectEntries(source)).toEqual(expected);
	});

	it('given array readonly then returns expected', () => {
		const source = ['Hello', 420] as const;
		const expected = [
			['0', 'Hello'],
			['1', 420],
		];

		expect<Array<[`${number}`, 'Hello' | 420]>>(objectEntries(source)).toEqual(expected);
	});

	it('given basic then returns expected', () => {
		const source = { a: 'Hello', b: 420 };
		const expected = [
			['a', 'Hello'],
			['b', 420],
		];

		expect<Array<['a' | 'b', string | number]>>(objectEntries(source)).toEqual(expected);
	});

	it('given deep then returns expected', () => {
		const source = { a: 'Hello', b: 420, deep: { i: [] } };
		const expected = [
			['a', 'Hello'],
			['b', 420],
			['deep', { i: [] }],
		];

		expect<Array<['a' | 'b' | 'deep', string | number | { i: never[] }]>>(objectEntries(source)).toEqual(expected);
	});

	it('given array then returns expected', () => {
		const source = ['Hello', 420];
		const expected = [
			['0', 'Hello'],
			['1', 420],
		];

		expect<Array<[`${number}`, string | number]>>(objectEntries(source)).toEqual(expected);
	});
});
