import { BitField } from '../src/lib/bitField';

describe('bitField', () => {
	const NumberFlags = {
		Read: 1,
		Write: 2,
		Edit: 4,
		Delete: 8,
	} as const;

	const BigIntFlags = {
		Read: 1n,
		Write: 2n,
		Edit: 4n,
		Delete: 8n,
	} as const;

	describe('constructor', () => {
		it('given a valid mapped number flag set then returns a number BitField', () => {
			const bitfield = new BitField(NumberFlags);
			expect<BitField<typeof NumberFlags>>(bitfield);
			expect<'number'>(bitfield.type).toBe('number');
			expect<0>(bitfield.zero).toBe(0);
			expect<number>(bitfield.mask).toBe(15);
			expect<typeof NumberFlags>(bitfield.flags).toBe(NumberFlags);
		});

		it('given a valid mapped bigint flag set then returns a bigint BitField', () => {
			const bitfield = new BitField(BigIntFlags);
			expect<BitField<typeof BigIntFlags>>(bitfield);
			expect<'bigint'>(bitfield.type).toBe('bigint');
			expect<0n>(bitfield.zero).toBe(0n);
			expect<bigint>(bitfield.mask).toBe(15n);
			expect<typeof BigIntFlags>(bitfield.flags).toBe(BigIntFlags);
		});

		it.each([true, 42, 10n, 'foo', undefined])('given a non-object then throws TypeError', (value) => {
			const given = () => new BitField(value as any);
			const expected = 'flags must be a non-null object';

			expect(given).toThrowError(expected);
		});

		it('given a null object then throws TypeError', () => {
			const given = () => new BitField(null as any);
			const expected = 'flags must be a non-null object';

			expect(given).toThrowError(expected);
		});

		it('given an empty object then throws TypeError', () => {
			const given = () => new BitField({});
			const expected = 'flags must be a non-empty object';

			expect(given).toThrowError(expected);
		});

		it.each([true, {}, undefined, null, 'foo'])('given a null object then throws TypeError', (value) => {
			const given = () => new BitField({ Read: value } as any);
			const expected = 'A bitfield can only use numbers or bigints for its values';

			expect(given).toThrowError(expected);
		});

		describe('number', () => {
			it.each([true, {}, 42n, undefined, null, 'foo'])('given a null object then throws TypeError', (value) => {
				const given = () => new BitField({ Read: 1, Write: value } as any);
				const expected = 'The property "Write" does not resolve to a number';

				expect(given).toThrowError(expected);
			});

			it.each([1.2, 4294967296])('given an empty object then throws TypeError', (value) => {
				const given = () => new BitField({ Read: value });
				const expected = 'The property "Read" does not resolve to a safe bitfield value';

				expect(given).toThrowError(expected);
			});

			it.each([0, -8])('given an empty object then throws TypeError', (value) => {
				const given = () => new BitField({ Read: value });
				const expected = 'The property "Read" resolves to a non-positive value';

				expect(given).toThrowError(expected);
			});
		});

		describe('bigint', () => {
			it.each([true, {}, 42, undefined, null, 'foo'])('given a null object then throws TypeError', (value) => {
				const given = () => new BitField({ Read: 1n, Write: value } as any);
				const expected = 'The property "Write" does not resolve to a bigint';

				expect(given).toThrowError(expected);
			});

			it.each([0n, -8n])('given an empty object then throws TypeError', (value) => {
				const given = () => new BitField({ Read: value });
				const expected = 'The property "Read" resolves to a non-positive value';

				expect(given).toThrowError(expected);
			});
		});
	});

	describe('prototype', () => {
		const bitfield = new BitField(NumberFlags);

		describe('resolve', () => {
			it('given a number then returns the same number', () => {
				const given = bitfield.resolve(NumberFlags.Write);
				const expected = NumberFlags.Write;

				expect<number>(given).toBe(expected);
			});

			it('given a string then returns the same number', () => {
				const given = bitfield.resolve('Write');
				const expected = NumberFlags.Write;

				expect<number>(given).toBe(expected);
			});

			it('given an empty array then returns ∅', () => {
				const given = bitfield.resolve([]);
				const expected = bitfield.zero;

				expect<number>(given).toBe(expected);
			});

			it('given a number and a string in array then returns the combined number', () => {
				const given = bitfield.resolve([NumberFlags.Write, 'Edit']);
				const expected = NumberFlags.Write | NumberFlags.Edit;

				expect<number>(given).toBe(expected);
			});

			it('given an out-of-bounds number then returns ∅', () => {
				const given = bitfield.resolve(16);
				const expected = 0;

				expect<number>(given).toBe(expected);
			});

			it.each([4n, undefined, true])('given %o then throws TypeError', (value) => {
				const given = () => bitfield.resolve(value as any);
				const expected = 'Received a value that is not either type "string", type "number", or an Array';

				expect(given).toThrowError(expected);
			});

			it.each(['Execute', 'Foo'])('given %s then throws RangeError', (value) => {
				const given = () => bitfield.resolve(value as any);
				const expected = 'Received a name that could not be resolved to a property of flags';

				expect(given).toThrowError(expected);
			});

			it.each([null, {}])('given non-Array object then throws TypeError', (value) => {
				const given = () => bitfield.resolve(value as any);
				const expected = 'Received an object value that is not an Array';

				expect(given).toThrowError(expected);
			});
		});

		describe('any', () => {
			it('given A ⊇ B then returns true', () => {
				const given = bitfield.any(['Write', 'Delete'], ['Write', 'Delete']);
				const expected = true;

				expect(given).toBe(expected);
			});

			it('given A ⊃ B then returns false', () => {
				const given = bitfield.any(['Write', 'Delete'], ['Write']);
				const expected = true;

				expect(given).toBe(expected);
			});

			it('given A ∩ B ≠ ∅ then returns true', () => {
				const given = bitfield.any(['Write', 'Delete'], ['Write', 'Read']);
				const expected = true;

				expect(given).toBe(expected);
			});

			it('given A ⊅ B then returns false', () => {
				const given = bitfield.any(['Write', 'Delete'], ['Read']);
				const expected = false;

				expect(given).toBe(expected);
			});
		});

		describe('has', () => {
			it('given A ⊇ B then returns true', () => {
				const given = bitfield.has(['Write', 'Delete'], ['Write', 'Delete']);
				const expected = true;

				expect(given).toBe(expected);
			});

			it('given A ⊃ B then returns false', () => {
				const given = bitfield.has(['Write', 'Delete'], ['Write']);
				const expected = true;

				expect(given).toBe(expected);
			});

			it('given A ∩ B ≠ ∅ then returns false', () => {
				const given = bitfield.has(['Write', 'Delete'], ['Write', 'Read']);
				const expected = false;

				expect(given).toBe(expected);
			});

			it('given A ⊅ B then returns false', () => {
				const given = bitfield.has(['Write', 'Delete'], ['Read']);
				const expected = false;

				expect(given).toBe(expected);
			});
		});

		describe('complement', () => {
			it('given Write | Delete then returns Read | Edit', () => {
				const given = bitfield.complement(['Write', 'Delete']);
				const expected = NumberFlags.Read | NumberFlags.Edit;

				expect<number>(given).toBe(expected);
			});

			it('given Read | Write | Edit | Delete then returns ∅', () => {
				const given = bitfield.complement(['Read', 'Write', 'Edit', 'Delete']);
				const expected = bitfield.zero;

				expect<number>(given).toBe(expected);
			});
		});

		describe('union', () => {
			it('given no arguments then returns ∅', () => {
				expect<number>(bitfield.union()).toBe(0);
			});

			it('given Read, Write, Delete then returns Read | Write | Delete', () => {
				expect<number>(bitfield.union('Read', 'Write', 'Delete')).toBe(NumberFlags.Read | NumberFlags.Write | NumberFlags.Delete);
			});
		});

		describe('intersection', () => {
			it('given A ⋂ B = ∅ then returns ∅', () => {
				const given = bitfield.intersection('Read', 'Write');
				const expected = bitfield.zero;

				expect<number>(given).toBe(expected);
			});

			it('given A ⋂ B ≠ ∅ then returns a non-empty field', () => {
				const given = bitfield.intersection('Read', ['Read', 'Write']);
				const expected = NumberFlags.Read;

				expect<number>(given).toBe(expected);
			});
		});

		describe('difference', () => {
			it('given A ∖ B = ∅ then returns A', () => {
				const given = bitfield.difference(['Read', 'Write'], 'Edit');
				const expected = NumberFlags.Read | NumberFlags.Write;

				expect<number>(given).toBe(expected);
			});

			it('given A ∖ B ≠ ∅ then returns A without B\'s bits', () => {
				const given = bitfield.difference(['Read', 'Write', 'Edit'], 'Edit');
				const expected = NumberFlags.Read | NumberFlags.Write;

				expect<number>(given).toBe(expected);
			});
		});

		describe('symmetricDifference', () => {
			it('given A ⋂ B = ∅ then returns A ∪ B', () => {
				const given = bitfield.symmetricDifference(['Read', 'Write'], ['Edit', 'Delete']);
				const expected = NumberFlags.Read | NumberFlags.Write | NumberFlags.Edit | NumberFlags.Delete;

				expect<number>(given).toBe(expected);
			});

			it('given A ⋂ B ≠ ∅ then returns (A ∖ B) ∪ (B ∖ A)', () => {
				const given = bitfield.symmetricDifference(['Read', 'Write', 'Delete'], ['Read', 'Edit', 'Delete']);
				const expected = NumberFlags.Write | NumberFlags.Edit;

				expect<number>(given).toBe(expected);
			});
		});

		describe('toArray', () => {
			it('given ∅ then returns empty array', () => {
				const given = bitfield.toArray(bitfield.zero);
				const expected = [] as const;

				expect<string[]>(given).toEqual(expected);
			});

			it('given multiple values then returns array with given values', () => {
				const given = bitfield.toArray(['Read', 'Delete']);
				const expected = ['Read', 'Delete'] as const;

				expect<string[]>(given).toEqual(expected);
			});

			it('given duplicated values then returns array with deduplicated values', () => {
				const given = bitfield.toArray(['Read', 'Delete', 'Read']);
				const expected = ['Read', 'Delete'] as const;

				expect<string[]>(given).toEqual(expected);
			});

			it('given out-of-range values then returns array with correct values', () => {
				const given = bitfield.toArray(['Read', 'Delete', 16]);
				const expected = ['Read', 'Delete'] as const;

				expect<string[]>(given).toEqual(expected);
			});
		});

		describe('toKeys', () => {
			it('given ∅ then returns empty iterator', () => {
				const given = [...bitfield.toKeys(bitfield.zero)];
				const expected = [] as const;

				expect<string[]>(given).toEqual(expected);
			});

			it('given multiple values then returns iterator with given values', () => {
				const given = [...bitfield.toKeys(['Read', 'Delete'])];
				const expected = ['Read', 'Delete'] as const;

				expect<string[]>(given).toEqual(expected);
			});

			it('given duplicated values then returns iterator with deduplicated values', () => {
				const given = [...bitfield.toKeys(['Read', 'Delete', 'Read'])];
				const expected = ['Read', 'Delete'] as const;

				expect<string[]>(given).toEqual(expected);
			});

			it('given out-of-range values then returns iterator with correct values', () => {
				const given = [...bitfield.toKeys(['Read', 'Delete', 16])];
				const expected = ['Read', 'Delete'] as const;

				expect<string[]>(given).toEqual(expected);
			});
		});

		describe('toValues', () => {
			it('given ∅ then returns empty iterator', () => {
				const given = [...bitfield.toValues(bitfield.zero)];
				const expected = [] as const;

				expect<number[]>(given).toEqual(expected);
			});

			it('given multiple values then returns iterator with given values', () => {
				const given = [...bitfield.toValues(['Read', 'Delete'])];
				const expected = [1, 8] as const;

				expect<number[]>(given).toEqual(expected);
			});

			it('given duplicated values then returns iterator with deduplicated values', () => {
				const given = [...bitfield.toValues(['Read', 'Delete', 'Read'])];
				const expected = [1, 8] as const;

				expect<number[]>(given).toEqual(expected);
			});

			it('given out-of-range values then returns iterator with correct values', () => {
				const given = [...bitfield.toValues(['Read', 'Delete', 16])];
				const expected = [1, 8] as const;

				expect<number[]>(given).toEqual(expected);
			});
		});

		describe('toEntries', () => {
			it('given ∅ then returns empty iterator', () => {
				const given = [...bitfield.toEntries(bitfield.zero)];
				const expected = [] as const;

				expect<Array<[string, number]>>(given).toEqual(expected);
			});

			it('given multiple values then returns iterator with given values', () => {
				const given = [...bitfield.toEntries(['Read', 'Delete'])];
				const expected = [
					['Read', 1],
					['Delete', 8],
				] as const;

				expect<Array<[string, number]>>(given).toEqual(expected);
			});

			it('given duplicated values then returns iterator with deduplicated values', () => {
				const given = [...bitfield.toEntries(['Read', 'Delete', 'Read'])];
				const expected = [
					['Read', 1],
					['Delete', 8],
				] as const;

				expect<Array<[string, number]>>(given).toEqual(expected);
			});

			it('given out-of-range values then returns iterator with correct values', () => {
				const given = [...bitfield.toEntries(['Read', 'Delete', 16])];
				const expected = [
					['Read', 1],
					['Delete', 8],
				] as const;

				expect<Array<[string, number]>>(given).toEqual(expected);
			});
		});

		describe('toObject', () => {
			type Expected = { [K in keyof typeof NumberFlags]: boolean };

			it('given ∅ then returns object with false values', () => {
				const given = bitfield.toObject(bitfield.zero);
				const expected: Expected = { Read: false, Write: false, Edit: false, Delete: false };

				expect<Expected>(given).toEqual(expected);
			});

			it('given multiple values then returns array with given values', () => {
				const given = bitfield.toObject(['Read', 'Delete']);
				const expected: Expected = { Read: true, Write: false, Edit: false, Delete: true };

				expect<Expected>(given).toEqual(expected);
			});

			it('given out-of-range values then returns array with correct values', () => {
				const given = bitfield.toObject(['Read', 'Delete', 16]);
				const expected: Expected = { Read: true, Write: false, Edit: false, Delete: true };

				expect<Expected>(given).toEqual(expected);
			});
		});
	});
});
