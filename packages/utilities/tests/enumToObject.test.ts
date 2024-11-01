import { enumToObject } from '../src/lib/enumToObject';

describe('enumToObject', () => {
	it('given an enum with number values then returns a 1-way object', () => {
		enum Test {
			A,
			B,
			C,
		}

		interface Expects {
			A: Test.A;
			B: Test.B;
			C: Test.C;
		}

		expect<Expects>(enumToObject(Test)).toStrictEqual<Expects>({
			A: Test.A,
			B: Test.B,
			C: Test.C,
		});
	});

	it('given an enum with string values then returns an identical object', () => {
		enum Test {
			A = 'a',
			B = 'b',
			C = 'c',
		}

		interface Expects {
			A: Test.A;
			B: Test.B;
			C: Test.C;
		}

		expect<Expects>(enumToObject(Test)).toStrictEqual<Expects>({
			A: Test.A,
			B: Test.B,
			C: Test.C,
		});
	});
});
