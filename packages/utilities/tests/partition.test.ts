import { partition } from '../src';

describe('partition', () => {
	it('given input not an array then throws TypeError', () => {
		// @ts-expect-error: fail case
		const thrownCall = () => partition({});
		expect(thrownCall).toThrow(TypeError);
		expect(thrownCall).toThrow('entries must be an array');
	});

	it('given predicate is not a function then throws TypeError', () => {
		// @ts-expect-error: fail case
		const thrownCall = () => partition(['one', 'two', 'three'], 'not-a-function');
		expect(thrownCall).toThrow(TypeError);
		expect(thrownCall).toThrow('predicate must be an function that returns a boolean value.');
	});

	it('given valid input then partitions array', () => {
		expect(partition([1, 2, 3, 4, 5, 6], value => value > 3)).toStrictEqual([
			[4, 5, 6],
			[1, 2, 3],
		]);
	});
});
