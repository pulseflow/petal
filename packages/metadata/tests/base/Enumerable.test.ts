import { Enumerable } from '../../src/lib/base';

describe('enumerable', () => {
	it('given enumerable=false then should not be enumerable', () => {
		class Sample {
			@Enumerable(false)
			public name = 'name';
		}

		expect(Sample.prototype).toEqual({});
	});
});
