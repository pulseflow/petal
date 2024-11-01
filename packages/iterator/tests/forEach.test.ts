import { forEach } from '../src';

describe('forEach', () => {
	it('given iterable and callback function then calls the callback function for each element', () => {
		const iterable = [1, 2, 3];
		const cmp = vi.fn();
		forEach(iterable, cmp);
		expect(cmp).toHaveBeenCalledTimes(3);
		expect(cmp).toHaveBeenCalledWith(1, 0);
		expect(cmp).toHaveBeenCalledWith(2, 1);
		expect(cmp).toHaveBeenCalledWith(3, 2);
	});

	it('given empty iterable then does not call the callback function', () => {
		const iterable: number[] = [];
		const cmp = vi.fn();
		forEach(iterable, cmp);
		expect(cmp).not.toHaveBeenCalled();
	});

	it('given iterable and invalid callback function then throws TypeError', () => {
		const iterable = [1, 2, 3];
		const cmp = 'invalid' as any;
		expect(() => forEach(iterable, cmp)).toThrow(new TypeError('invalid must be a function'));
	});
});
