import { last } from '../src';

describe('last', () => {
	it('given non-empty iterable then returns last element', () => {
		const iterable = [1, 2, 3];
		const result = last(iterable);
		expect(result).toBe(3);
	});

	it('given empty iterable then returns undefined', () => {
		const iterable: number[] = [];
		const result = last(iterable);
		expect(result).toBeUndefined();
	});

	it('given string iterable then returns last character', () => {
		const iterable = 'hello';
		const result = last(iterable);
		expect(result).toBe('o');
	});

	it('given object iterable then returns last object', () => {
		const iterable = [{ id: 1 }, { id: 2 }, { id: 3 }];
		const result = last(iterable);
		expect(result).toEqual({ id: 3 });
	});
});
