import { range } from '../src';

describe('range', () => {
	it('given positive min,max,step then returns range array', () => {
		expect(range(1, 3, 1)).toEqual([1, 2, 3]);
	});

	it('given positive min,max negative step then returns empty array', () => {
		expect(range(1, 3, -2)).toEqual([]);
	});

	it('given negative min positive max,step then returns range array', () => {
		expect(range(-1, 3, 2)).toEqual([-1, 1, 3]);
	});

	it('given negative min,max,step then returns negative range array', () => {
		expect(range(-1, -3, -1)).toEqual([-1, -2, -3]);
	});

	it('given negative min (lower than max),max positive step then gives negative range', () => {
		expect(range(-3, -1, 1)).toEqual([-3, -2, -1]);
	});
});
