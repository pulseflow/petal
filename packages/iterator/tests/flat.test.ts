import { flat } from '../src';

describe('flat', () => {
	it('given nested iterable then returns flattened iterable', () => {
		const nestedIterable = [
			[1, 2],
			[3, 4],
			[5, 6],
		];
		const result = [...flat(nestedIterable)];
		expect(result).toEqual([1, 2, 3, 4, 5, 6]);
	});

	it('given deeply nested iterable then returns flattened iterable in the first level', () => {
		const deeplyNestedIterable = [
			[
				[1, 2],
				[3, 4],
			],
			[
				[5, 6],
				[7, 8],
			],
		];
		const result = [...flat(deeplyNestedIterable)];
		expect(result).toEqual([
			[1, 2],
			[3, 4],
			[5, 6],
			[7, 8],
		]);
	});

	it('given empty iterable then returns empty iterable', () => {
		const emptyIterable: number[][] = [];
		const result = [...flat(emptyIterable)];
		expect(result).toEqual([]);
	});
});
