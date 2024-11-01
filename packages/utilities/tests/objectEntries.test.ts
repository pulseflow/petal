import { objectEntries } from '../src';

describe('objectEntries', () => {
	it('given basic readonly then returns expected', () => {
		const source = { a: 'Hello', b: 420 } as const;
		const expected = [
			['a', 'Hello'],
			['b', 420],
		] as Array<[string, unknown]>;

		expect<Array<['a' | 'b', 'Hello' | 420]>>(objectEntries(source)).toEqual(expected);
	});

	it('given deep readonly then returns expected', () => {
		const source = { a: 'Hello', b: 420, deep: { i: [] } } as const;
		const expected = [
			['a', 'Hello'],
			['b', 420],
			['deep', { i: [] }],
		] as Array<[string, unknown]>;

		expect<Array<['a' | 'b' | 'deep', 'Hello' | 420 | { i: readonly [] }]>>(objectEntries(source)).toEqual(expected);
	});

	it('given basic then returns expected', () => {
		const source = { a: 'Hello', b: 420 };
		const expected = [
			['a', 'Hello'],
			['b', 420],
		] as Array<[string, unknown]>;

		expect(objectEntries(source)).toEqual(expected);
	});

	it('given deep then returns expected', () => {
		const source = { a: 'Hello', b: 420, deep: { i: [] } };
		const expected = [
			['a', 'Hello'],
			['b', 420],
			['deep', { i: [] }],
		] as Array<[string, unknown]>;

		expect(objectEntries(source)).toEqual(expected);
	});
});
