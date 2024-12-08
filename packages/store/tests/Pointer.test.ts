import { Pointer } from '../src';

describe('pointer', () => {
	it('given a pointer then it has the correct initial properties', () => {
		const pointer = new Pointer();
		expect(pointer.value).toBe(0);
	});

	it('given a pointer with an added value then returns the correct values', () => {
		const pointer = new Pointer();
		pointer.add(5);
		expect(pointer.value).toBe(5);
	});

	it.each(['foo', () => {}, -1, 2147483648])('given a pointer with an invalid length value then throws', (value) => {
		const pointer = new Pointer();
		// @ts-expect-error: Testing invalid input
		expect(() => pointer.add(value)).toThrowError('The pointer value cannot be an invalid length value');
	});

	describe('from', () => {
		it('given a pointer with a value then it returns a new instance with the same value', () => {
			const pointer = Pointer.from(5);
			expect(pointer.value).toBe(5);
		});

		it.each(['foo', () => {}, -1, 2147483648, 5.5])('given an invalid length value then throws', (value) => {
			// @ts-expect-error: Testing invalid input
			expect(() => Pointer.from(value)).toThrowError('The pointer value cannot be an invalid length value');
		});
	});
});
