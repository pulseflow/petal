import { find } from '../src';

describe('find', () => {
	it('given iterable with matching element then returns the element', () => {
		const iterable = [1, 2, 3, 4, 5];
		const cmp = (element: number) => element % 2 === 0;
		const result = find(iterable, cmp);
		expect(result).toBe(2);
	});

	it('given iterable with no matching element then returns undefined', () => {
		const iterable = [1, 3, 5, 7, 9];
		const cmp = (element: number) => element % 2 === 0;
		const result = find(iterable, cmp);
		expect(result).toBeUndefined();
	});

	it('given empty iterable then returns undefined', () => {
		const iterable: number[] = [];
		const cmp = (element: number) => element % 2 === 0;
		const result = find(iterable, cmp);
		expect(result).toBeUndefined();
	});

	it('given iterable and invalid callback function then throws TypeError', () => {
		const iterable = [1, 2, 3, 4, 5];
		const cmp = 'invalid' as any;
		expect(() => find(iterable, cmp)).toThrow(new TypeError('invalid must be a function'));
	});
});
