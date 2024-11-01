import { pickRandom } from '../src';

describe('pickRandom', () => {
	it('given array then picks one random element', () => {
		const array = ['a', 'b', 'c'];
		expect(array).toContain(pickRandom(array));
	});

	it('given count of one then picks one random element', () => {
		const array = ['a', 'b', 'c'];
		expect(array).toContain(pickRandom(array, 1));
	});

	it('given count of two then picks two random elements', () => {
		const array = ['a', 'b', 'c'];
		const picked = pickRandom(array, 2);

		expect(picked).toHaveLength(2);
		expect(array).toEqual(expect.arrayContaining(picked));
	});

	it('given empty array then returns an empty array', () => {
		const array: never[] = [];
		const picked = pickRandom(array, 2);

		expect(picked).toHaveLength(0);
		expect(array).toEqual(expect.arrayContaining(picked));
	});
});
