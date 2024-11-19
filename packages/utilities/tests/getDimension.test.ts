import { getDimension } from '../src/lib/getDimension';

describe('getDimension', () => {
	it('should get the dimension of a simple array', () => {
		expect(getDimension(1)).toBe(0);
		expect(getDimension(null)).toBe(0);
		expect(getDimension(['555'])).toBe(1);
		expect(getDimension([['3', 4], 5])).toBe(2);
		expect(getDimension([[[[[[['33']]]]]]])).toBe(7);
		expect(getDimension(undefined)).toBe(0);
	});
});
