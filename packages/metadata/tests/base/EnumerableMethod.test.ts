import { EnumerableMethod } from '../../src/lib/base';

describe('enumerableMethod', () => {
	it('given enumerable=false then should not be enumerable', () => {
		class Sample {
			@EnumerableMethod(false)
			public getName() {
				return 'name';
			}
		}

		expect(Sample.prototype).toEqual({});
	});
});
