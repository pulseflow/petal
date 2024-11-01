import { noop } from '../src';

describe('noop', () => {
	it('given noop then has undefined return type', () => {
		expect(noop()).toBeUndefined();
	});
});
