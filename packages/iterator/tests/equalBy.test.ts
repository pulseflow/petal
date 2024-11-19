import { equalBy } from '../src/lib/equalBy.ts';

describe('equalBy', () => {
	it('given two equal iterables AND x === y then returns true', () => {
		const x = [1, 2, 3, 4];
		const y = [1, 2, 3, 4];
		const result = equalBy(x, y, (x, y) => x === y);
		expect<boolean>(result).toBe(true);
	});

	it('given two distinct iterables AND x === y then returns false', () => {
		const x = [1, 2, 3, 4];
		const y = [1, 4, 9, 16];
		const result = equalBy(x, y, (x, y) => x === y);
		expect<boolean>(result).toBe(false);
	});

	it('given [1, 2, 3, 4], its square AND x * x === y then returns true', () => {
		const x = [1, 2, 3, 4];
		const y = [1, 4, 9, 16];
		const result = equalBy(x, y, (x, y) => x * x === y);
		expect<boolean>(result).toBe(true);
	});
});
