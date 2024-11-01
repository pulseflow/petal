import { mergeObjects } from '../src';

describe('mergeObjects', () => {
	it('given basic then returns expected', () => {
		const source = { a: 0, b: 1 };
		const target = {};
		expect(mergeObjects(target, source)).toEqual({ a: 0, b: 1 });
	});

	it('given mutation then returns expected', () => {
		expect.assertions(2);

		const source = { a: 0, b: 1 };
		const target = {};
		mergeObjects(target, source);

		expect(source).toEqual({ a: 0, b: 1 });
		expect(target).toEqual({ a: 0, b: 1 });
	});

	it('given clone then returns expected', () => {
		const source = { a: 0, b: 1 };
		const target = {};
		expect(mergeObjects(target, source)).toEqual({ a: 0, b: 1 });
	});

	it('given partial then returns expected', () => {
		const source = { a: 0, b: 1 };
		const target = { a: 2 };
		expect(mergeObjects(target, source)).toEqual({ a: 0, b: 1 });
	});

	it('given extended then returns expected', () => {
		const source = { a: 0, b: 1 };
		const target = { a: 2, i: 2 };
		expect(mergeObjects(target, source)).toEqual({ a: 0, b: 1, i: 2 });
	});

	it('given deep then returns expected', () => {
		const source = { a: 0 };
		const target = { b: { i: 4 } };
		expect(mergeObjects(target, source)).toEqual({ a: 0, b: { i: 4 } });
	});

	it('given deep-replace then returns expected', () => {
		const source = { a: { i: 4 } };
		const target = { a: 0 };
		expect(mergeObjects(target, source)).toEqual({ a: { i: 4 } });
	});

	it('given deep-merge then returns expected', () => {
		const source = { a: { b: 1 } };
		const target = { a: { i: 1 } };
		expect(mergeObjects(target, source)).toEqual({ a: { b: 1, i: 1 } });
	});

	it('given deep-type-mismatch then returns expected', () => {
		const source = { a: 0 };
		const target = { a: { b: 1 } };
		expect(mergeObjects(target, source)).toEqual({ a: { b: 1 } });
	});
});
