import { objectValues } from '../src';

describe('objectValues', () => {
	it('given basic readonly then returns expected (typed)', () => {
		const source = { a: 'Hello', b: 420 } as const;
		const expected = ['Hello', 420];

		expect<Array<'Hello' | 420>>(objectValues(source)).toEqual(expected);
	});

	it('given deep readonly then returns expected', () => {
		const source = { a: 'Hello', b: 420, deep: { i: [] } } as const;
		const expected = ['Hello', 420, { i: [] }];

		expect<Array<'Hello' | 420 | { i: readonly [] }>>(objectValues(source)).toEqual(expected);
	});

	it('given basic readonly then returns expected', () => {
		const source = { a: 'Hello', b: 420 };
		const expected = ['Hello', 420];

		expect(objectValues(source)).toEqual(expected);
	});

	it('given deep then returns expected', () => {
		const source = { a: 'Hello', b: 420, deep: { i: [] } };
		const expected = ['Hello', 420, { i: [] }];

		expect(objectValues(source)).toEqual(expected);
	});
});
