import { range } from '../src';

describe('range', () => {
	it('given start and end then returns range from start to end', () => {
		const start = 1;
		const end = 5;
		const result = [...range(start, end)];
		expect(result).toEqual([1, 2, 3, 4]);
	});

	it('given start greater than end then returns empty iterable', () => {
		const start = 5;
		const end = 1;
		const result = [...range(start, end)];
		expect(result).toEqual([5, 4, 3, 2]);
	});

	it('given start equal to end then returns single-element iterable', () => {
		const start = 5;
		const end = 5;
		const result = [...range(start, end)];
		expect(result).toEqual([]);
	});

	it('given start, end, and step then returns range with step', () => {
		const start = 1;
		const end = 5;
		const step = 2;
		const result = [...range(start, end, step)];
		expect(result).toEqual([1, 3]);
	});

	it('given start, end, and negative step then returns range with negative step', () => {
		const start = 5;
		const end = 1;
		const step = -2;
		const result = [...range(start, end, step)];
		expect(result).toEqual([5, 3]);
	});

	it('given start, end, and zero step then throws RangeError', () => {
		const start = 1;
		const end = 5;
		const step = 0;
		expect(() => [...range(start, end, step)]).toThrow(new RangeError('Step cannot be zero'));
	});

	it('given start greater than end and positive step then throws RangeError', () => {
		const start = 5;
		const end = 1;
		const step = 1;
		expect(() => [...range(start, end, step)]).toThrow(new RangeError('Start must be less than end when step is positive'));
	});

	it('given start less than end and negative step then throws RangeError', () => {
		const start = 1;
		const end = 5;
		const step = -1;
		expect(() => [...range(start, end, step)]).toThrow(new RangeError('Start must be greater than end when step is negative'));
	});

	it('given start, end, and NaN step then throws RangeError', () => {
		const start = 1;
		const end = 5;
		const step = Number.NaN;
		expect(() => [...range(start, end, step)]).toThrow(new RangeError('NaN must be a non-NaN number'));
	});
});
