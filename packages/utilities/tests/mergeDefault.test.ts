import { mergeDefault } from '../src';

describe('mergeDefault', () => {
	it('given empty overwrites then returns base', () => {
		const base = { a: 0, b: 1 };
		const overwrites = {};
		expect(mergeDefault(base, overwrites)).toStrictEqual(base);
	});

	it('given empty overwrites then returns mutates overwrites', () => {
		const base = { a: 0, b: 1 };
		const overwrites = {};

		mergeDefault(base, overwrites);

		expect(base).toStrictEqual({ a: 0, b: 1 });
		expect(overwrites).toStrictEqual({ a: 0, b: 1 });
	});

	it('given different key date values then returns same dates all keys', () => {
		interface TestObject {
			dateTime?: Date;
			timeDate?: Date;
		}

		const base: TestObject = { dateTime: new Date('1995-02-21T12:45:00.000Z') };
		const overwrites: TestObject = { timeDate: new Date('2002-03-30T15:28:00.000Z') };

		mergeDefault(base, overwrites);

		expect(base).toStrictEqual({ dateTime: new Date('1995-02-21T12:45:00.000Z') });
		expect(overwrites).toStrictEqual({ dateTime: new Date('1995-02-21T12:45:00.000Z'), timeDate: new Date('2002-03-30T15:28:00.000Z') });
	});

	it('given undefined overwrites then returns clones base', () => {
		const base = { a: 0, b: 1 };
		expect(mergeDefault(base)).toStrictEqual({ a: 0, b: 1 });
	});

	it('given partial overwrites then returns merged object', () => {
		const base = { a: 0, b: 1 };
		const overwrites = { a: 2 };
		expect(mergeDefault(base, overwrites)).toStrictEqual({ a: 2, b: 1 });
	});

	it('given extended overwrites then returns merged object', () => {
		const base = { a: 0, b: 1 };
		const overwrites = { a: 2, i: 3 };
		expect(mergeDefault(base, overwrites)).toStrictEqual({ a: 2, b: 1, i: 3 });
	});

	it('given partial-null overwrites then returns null plus base keys', () => {
		interface Sample {
			a: null | number;
			b: number;
		}

		const base: Sample = { a: 0, b: 1 };
		const overwrites: Partial<Sample> = { a: null };
		expect(mergeDefault(base, overwrites)).toStrictEqual({ a: null, b: 1 });
	});

	it('given partial-undefined overwrites then returns base value plus base keys', () => {
		const base = { a: 0, b: 1 };
		const overwrites = { a: undefined };
		expect(mergeDefault(base, overwrites)).toStrictEqual({ a: 0, b: 1 });
	});

	it('given deep object then returns all keys', () => {
		const base = { a: { b: 1 } };
		const overwrites = { a: { b: 2 } };
		expect(mergeDefault(base, overwrites)).toStrictEqual({ a: { b: 2 } });
	});

	it('given partial-null base and provided overwrites then returns overwrites values', () => {
		interface Sample {
			a: null | { b: number };
		}

		const base: Sample = { a: null };
		const overwrites: Sample = { a: { b: 5 } };

		expect(mergeDefault(base, overwrites)).toStrictEqual({ a: { b: 5 } });
	});

	it('given defined base and provided overwrites then returns overwrites values', () => {
		interface Sample {
			a: number | { b: boolean };
		}

		const base: Sample = { a: 1 };
		const overwrites: Sample = { a: { b: true } };

		expect(mergeDefault(base, overwrites)).toStrictEqual({ a: { b: true } });
	});
});
