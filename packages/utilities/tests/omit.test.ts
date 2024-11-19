import { omit } from '../src/lib/omit';

describe('omit', () => {
	it('should omit elements', () => {
		const object = {
			Testing: 'hi',
			Tester: 'hi' as const,
		};

		// TODO
		expect(omit(object, 'Tester', 'Tester', 'Tester').Testing).toBe('hi');
	});
});
