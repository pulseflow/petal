import { boundMethods } from '../src/lib/boundMethods';

describe('boundMethods', () => {
	it('should bind methods from classes', () => {
		class Binding {
			public static readonly Testing = 'hi';

			/**
			 * meow
			 */
			public meow(this: void): typeof Binding.Testing {
				return Binding.Testing;
			}
		}

		const unbound = new Binding();
		const unboundMeowSpy = vi.spyOn(unbound, 'meow');
		const binding = boundMethods(unbound);
		const boundMeowSpy = vi.spyOn(binding, 'meow');

		expect(unboundMeowSpy).not.toHaveBeenCalled();
		expect(binding.meow()).toBe(Binding.Testing);
		expect(boundMeowSpy).toHaveBeenCalledOnce();
	});

	it('should bind methods from objects', () => {
		const unbound = {
			testing: 'hi',
			meow: () => unbound.testing,
		};

		const unboundMeowSpy = vi.spyOn(unbound, 'meow');
		const binding = boundMethods(unbound);
		const boundMeowSpy = vi.spyOn(binding, 'meow');

		expect(unboundMeowSpy).not.toHaveBeenCalled();
		expect(binding.meow()).toBe(unbound.testing);
		expect(boundMeowSpy).toHaveBeenCalledOnce();
	});
});
