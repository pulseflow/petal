import { isEmpty } from '../src';

describe('isEmpty', () => {
	it('given empty iterable then returns true', () => {
		const iterable: number[] = [];
		const result = isEmpty(iterable);
		expect(result).toBe(true);
	});

	it('given non-empty iterable then returns false', () => {
		const iterable = [1, 2, 3];
		const result = isEmpty(iterable);
		expect(result).toBe(false);
	});

	it('given iterable with one element then returns false', () => {
		const iterable = [1];
		const result = isEmpty(iterable);
		expect(result).toBe(false);
	});

	it('given iterator with one value and partial result then returns false', () => {
		const obj = {
			next() {
				return { value: 1 };
			},
		};
		const result = isEmpty(obj);
		expect(result).toBe(false);
	});
});
