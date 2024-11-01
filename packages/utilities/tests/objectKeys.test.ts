import { objectKeys } from '../src';

describe('objectKeys', () => {
	it('given basic readonly then returns expected', () => {
		const source = { a: 'Hello', b: 420 } as const;
		const expected = ['a', 'b'];

		expect<Array<'a' | 'b'>>(objectKeys(source)).toEqual(expected);
	});

	it('given deep readonly then returns expected', () => {
		const source = { a: 'Hello', b: 420, deep: { i: [] } } as const;
		const expected = ['a', 'b', 'deep'];

		expect<Array<'a' | 'b' | 'deep'>>(objectKeys(source)).toEqual(expected);
	});

	it('given basic then returns expected', () => {
		const source = { a: 'Hello', b: 420 };
		const expected = ['a', 'b'];

		expect(objectKeys(source)).toEqual(expected);
	});

	it('given deep then returns expected', () => {
		const source = { a: 'Hello', b: 420, deep: { i: [] } };
		const expected = ['a', 'b', 'deep'];

		expect(objectKeys(source)).toEqual(expected);
	});
});
