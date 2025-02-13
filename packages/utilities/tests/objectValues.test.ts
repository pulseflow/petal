import { objectValues } from '../src';

describe('objectValues', () => {
	it('given basic readonly then returns expected', () => {
		const source = { a: 'Hello', b: 420 } as const;
		const expected = ['Hello', 420];

		expect<Array<'Hello' | 420>>(objectValues(source)).toEqual(expected);
	});

	it('given deep readonly then returns expected', () => {
		const source = { a: 'Hello', b: 420, deep: { i: [] } } as const;
		const expected = ['Hello', 420, { i: [] }];

		expect<Array<'Hello' | 420 | { i: readonly [] }>>(objectValues(source)).toEqual(expected);
	});

	it('given array readonly then returns same', () => {
		const source = ['Hello', 420] as const;

		expect<Array<'Hello' | 420>>(objectValues(source)).toEqual(source);
	});

	it('given basic then returns expected', () => {
		const source = { a: 'Hello', b: 420 };
		const expected = ['Hello', 420];

		expect<Array<string | number>>(objectValues(source)).toEqual(expected);
	});

	it('given deep then returns expected', () => {
		const source = { a: 'Hello', b: 420, deep: { i: [] } };
		const expected = ['Hello', 420, { i: [] }];

		expect<Array<string | number | { i: never[] }>>(objectValues(source)).toEqual(expected);
	});

	it('given array then returns same', () => {
		const source = ['Hello', 420];

		expect<Array<string | number>>(objectValues(source)).toEqual(source);
	});
});
