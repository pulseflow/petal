import { objectToTuples } from '../src';

describe('objectToTuples', () => {
	it('given basic then returns expected', () => {
		const source = { a: 'Hello', b: 420 };
		const expected = [
			['a', 'Hello'],
			['b', 420],
		] as Array<[string, unknown]>;

		expect(objectToTuples(source)).toEqual(expected);
	});

	it('given deep then returns expected', () => {
		const source = { a: 'Hello', b: 420, deep: { i: [] } };
		const expected = [
			['a', 'Hello'],
			['b', 420],
			['deep.i', []],
		] as Array<[string, unknown]>;

		expect(objectToTuples(source)).toEqual(expected);
	});
});
