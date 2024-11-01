import { chunk } from '../src';

describe('chunk', () => {
	it('given input not an array then throws TypeError', () => {
		// @ts-expect-error: fail case
		const thrownCall = () => chunk({});
		expect(thrownCall).toThrow(TypeError);
		expect(thrownCall).toThrow('entries must be an array');
	});

	it('given chunks is not number then throws TypeError', () => {
		// @ts-expect-error: fail case
		const thrownCall = () => chunk(['one', 'two', 'three'], '5');
		expect(thrownCall).toThrow(TypeError);
		expect(thrownCall).toThrow('chunkSize must be an integer.');
	});

	it('given chunks is a whole number then throws TypeError', () => {
		const thrownCall = () => chunk(['one', 'two', 'three'], 5.654635412545);
		expect(thrownCall).toThrow(TypeError);
		expect(thrownCall).toThrow('chunkSize must be an integer.');
	});

	it('given chunks is smaller than 1 then throws TypeError', () => {
		const thrownCall = () => chunk(['one', 'two', 'three'], 0);
		expect(thrownCall).toThrow(RangeError);
		expect(thrownCall).toThrow('chunkSize must be 1 or greater.');
	});

	it('given valid input then chunks up array', () => {
		expect(chunk([1, 2, 3, 4, 5, 6], 2)).toStrictEqual([
			[1, 2],
			[3, 4],
			[5, 6],
		]);
	});
});
