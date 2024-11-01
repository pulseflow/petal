import { classExtends } from '../src';

describe('classExtends', () => {
	class BaseClass {
		protected name = 'baseClass';
	}

	class ExtendedClass extends BaseClass {
		protected override name = 'extendedClass';
	}

	it('given class that extends base class then returns true', () => {
		expect(classExtends(ExtendedClass, BaseClass)).toBe(true);
	});

	it('given class that does not extend base class then returns false', () => {
		class NewClass {
			public name = 'newClass';
		}

		expect(classExtends(NewClass, BaseClass)).toBe(false);
	});
});
