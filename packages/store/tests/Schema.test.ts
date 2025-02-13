import type { IType } from '../src';
import { Schema, SnowflakeType, StringType, t, UnalignedUint16Array } from '../src';

describe('schema', () => {
	it('given a new instance then it has the correct properties', () => {
		const schema = new Schema(1);
		expectTypeOf<Schema<1>>(schema);
		expect<1>(schema.id).toBe(1);
		expect(schema.bitSize).toBe(0);

		type Key = string;
		type Value = never;
		type Entry = readonly [Key, Value];

		expect<Key[]>([...schema.keys()]).toEqual([]);
		expect<Value[]>([...schema.values()]).toEqual([]);
		expect<Entry[]>([...schema.entries()]).toEqual([]);
		expect<Entry[]>([...schema]).toEqual([]);
	});

	describe('types', () => {
		it('given a schema with a boolean property then it has the correct properties and types', () => {
			type Key = 'a';
			type Value = typeof t.boolean;
			type Entry = readonly [Key, Value];

			const schema = new Schema(1).boolean('a');
			expectTypeOf<Schema<1, { a: Value }>>(schema);
			expect(schema.bitSize).toBe(1);

			expect<Key[]>([...schema.keys()]).toEqual(['a']);
			expect<Value[]>([...schema.values()]).toEqual([t.boolean]);
			expect<Entry[]>([...schema.entries()]).toEqual([['a', t.boolean]]);
		});

		it('given a schema with a bit property then it has the correct properties and types', () => {
			type Key = 'a';
			type Value = typeof t.bit;
			type Entry = readonly [Key, Value];

			const schema = new Schema(1).bit('a');
			expectTypeOf<Schema<1, { a: Value }>>(schema);
			expect(schema.bitSize).toBe(1);

			expect<Key[]>([...schema.keys()]).toEqual(['a']);
			expect<Value[]>([...schema.values()]).toEqual([t.bit]);
			expect<Entry[]>([...schema.entries()]).toEqual([['a', t.bit]]);
		});

		it('given a schema with an int2 property then it has the correct properties and types', () => {
			type Key = 'a';
			type Value = typeof t.int2;
			type Entry = readonly [Key, Value];

			const schema = new Schema(1).int2('a');
			expectTypeOf<Schema<1, { a: Value }>>(schema);
			expect(schema.bitSize).toBe(2);

			expect<Key[]>([...schema.keys()]).toEqual(['a']);
			expect<Value[]>([...schema.values()]).toEqual([t.int2]);
			expect<Entry[]>([...schema.entries()]).toEqual([['a', t.int2]]);
		});

		it('given a schema with an uint2 property then it has the correct properties and types', () => {
			type Key = 'a';
			type Value = typeof t.uint2;
			type Entry = readonly [Key, Value];

			const schema = new Schema(1).uint2('a');
			expectTypeOf<Schema<1, { a: Value }>>(schema);
			expect(schema.bitSize).toBe(2);

			expect<Key[]>([...schema.keys()]).toEqual(['a']);
			expect<Value[]>([...schema.values()]).toEqual([t.uint2]);
			expect<Entry[]>([...schema.entries()]).toEqual([['a', t.uint2]]);
		});

		it('given a schema with an int4 property then it has the correct properties and types', () => {
			type Key = 'a';
			type Value = typeof t.int4;
			type Entry = readonly [Key, Value];

			const schema = new Schema(1).int4('a');
			expectTypeOf<Schema<1, { a: Value }>>(schema);
			expect(schema.bitSize).toBe(4);

			expect<Key[]>([...schema.keys()]).toEqual(['a']);
			expect<Value[]>([...schema.values()]).toEqual([t.int4]);
			expect<Entry[]>([...schema.entries()]).toEqual([['a', t.int4]]);
		});

		it('given a schema with an uint4 property then it has the correct properties and types', () => {
			type Key = 'a';
			type Value = typeof t.uint4;
			type Entry = readonly [Key, Value];

			const schema = new Schema(1).uint4('a');
			expectTypeOf<Schema<1, { a: Value }>>(schema);
			expect(schema.bitSize).toBe(4);

			expect<Key[]>([...schema.keys()]).toEqual(['a']);
			expect<Value[]>([...schema.values()]).toEqual([t.uint4]);
			expect<Entry[]>([...schema.entries()]).toEqual([['a', t.uint4]]);
		});

		it('given a schema with an int8 property then it has the correct properties and types', () => {
			type Key = 'a';
			type Value = typeof t.int8;
			type Entry = readonly [Key, Value];

			const schema = new Schema(1).int8('a');
			expectTypeOf<Schema<1, { a: Value }>>(schema);
			expect(schema.bitSize).toBe(8);

			expect<Key[]>([...schema.keys()]).toEqual(['a']);
			expect<Value[]>([...schema.values()]).toEqual([t.int8]);
			expect<Entry[]>([...schema.entries()]).toEqual([['a', t.int8]]);
		});

		it('given a schema with an uint8 property then it has the correct properties and types', () => {
			type Key = 'a';
			type Value = typeof t.uint8;
			type Entry = readonly [Key, Value];

			const schema = new Schema(1).uint8('a');
			expectTypeOf<Schema<1, { a: Value }>>(schema);
			expect(schema.bitSize).toBe(8);

			expect<Key[]>([...schema.keys()]).toEqual(['a']);
			expect<Value[]>([...schema.values()]).toEqual([t.uint8]);
			expect<Entry[]>([...schema.entries()]).toEqual([['a', t.uint8]]);
		});

		it('given a schema with an int16 property then it has the correct properties and types', () => {
			type Key = 'a';
			type Value = typeof t.int16;
			type Entry = readonly [Key, Value];

			const schema = new Schema(1).int16('a');
			expectTypeOf<Schema<1, { a: Value }>>(schema);
			expect(schema.bitSize).toBe(16);

			expect<Key[]>([...schema.keys()]).toEqual(['a']);
			expect<Value[]>([...schema.values()]).toEqual([t.int16]);
			expect<Entry[]>([...schema.entries()]).toEqual([['a', t.int16]]);
		});

		it('given a schema with an uint16 property then it has the correct properties and types', () => {
			type Key = 'a';
			type Value = typeof t.uint16;
			type Entry = readonly [Key, Value];

			const schema = new Schema(1).uint16('a');
			expectTypeOf<Schema<1, { a: Value }>>(schema);
			expect(schema.bitSize).toBe(16);

			expect<Key[]>([...schema.keys()]).toEqual(['a']);
			expect<Value[]>([...schema.values()]).toEqual([t.uint16]);
			expect<Entry[]>([...schema.entries()]).toEqual([['a', t.uint16]]);
		});

		it('given a schema with an int32 property then it has the correct properties and types', () => {
			type Key = 'a';
			type Value = typeof t.int32;
			type Entry = readonly [Key, Value];

			const schema = new Schema(1).int32('a');
			expectTypeOf<Schema<1, { a: Value }>>(schema);
			expect(schema.bitSize).toBe(32);

			expect<Key[]>([...schema.keys()]).toEqual(['a']);
			expect<Value[]>([...schema.values()]).toEqual([t.int32]);
			expect<Entry[]>([...schema.entries()]).toEqual([['a', t.int32]]);
		});

		it('given a schema with an uint32 property then it has the correct properties and types', () => {
			type Key = 'a';
			type Value = typeof t.uint32;
			type Entry = readonly [Key, Value];

			const schema = new Schema(1).uint32('a');
			expectTypeOf<Schema<1, { a: Value }>>(schema);
			expect(schema.bitSize).toBe(32);

			expect<Key[]>([...schema.keys()]).toEqual(['a']);
			expect<Value[]>([...schema.values()]).toEqual([t.uint32]);
			expect<Entry[]>([...schema.entries()]).toEqual([['a', t.uint32]]);
		});

		it('given a schema with an int64 property then it has the correct properties and types', () => {
			type Key = 'a';
			type Value = typeof t.int64;
			type Entry = readonly [Key, Value];

			const schema = new Schema(1).int64('a');
			expectTypeOf<Schema<1, { a: Value }>>(schema);
			expect(schema.bitSize).toBe(64);

			expect<Key[]>([...schema.keys()]).toEqual(['a']);
			expect<Value[]>([...schema.values()]).toEqual([t.int64]);
			expect<Entry[]>([...schema.entries()]).toEqual([['a', t.int64]]);
		});

		it('given a schema with an uint64 property then it has the correct properties and types', () => {
			type Key = 'a';
			type Value = typeof t.uint64;
			type Entry = readonly [Key, Value];

			const schema = new Schema(1).uint64('a');
			expectTypeOf<Schema<1, { a: Value }>>(schema);
			expect(schema.bitSize).toBe(64);

			expect<Key[]>([...schema.keys()]).toEqual(['a']);
			expect<Value[]>([...schema.values()]).toEqual([t.uint64]);
			expect<Entry[]>([...schema.entries()]).toEqual([['a', t.uint64]]);
		});

		it('given a schema with a bigInt32 property then it has the correct properties and types', () => {
			type Key = 'a';
			type Value = typeof t.bigInt32;
			type Entry = readonly [Key, Value];

			const schema = new Schema(1).bigInt32('a');
			expectTypeOf<Schema<1, { a: Value }>>(schema);
			expect(schema.bitSize).toBe(32);

			expect<Key[]>([...schema.keys()]).toEqual(['a']);
			expect<Value[]>([...schema.values()]).toEqual([t.bigInt32]);
			expect<Entry[]>([...schema.entries()]).toEqual([['a', t.bigInt32]]);
		});

		it('given a schema with a bigUint32 property then it has the correct properties and types', () => {
			type Key = 'a';
			type Value = typeof t.bigUint32;
			type Entry = readonly [Key, Value];

			const schema = new Schema(1).bigUint32('a');
			expectTypeOf<Schema<1, { a: Value }>>(schema);
			expect(schema.bitSize).toBe(32);

			expect<Key[]>([...schema.keys()]).toEqual(['a']);
			expect<Value[]>([...schema.values()]).toEqual([t.bigUint32]);
			expect<Entry[]>([...schema.entries()]).toEqual([['a', t.bigUint32]]);
		});

		it('given a schema with a bigInt64 property then it has the correct properties and types', () => {
			type Key = 'a';
			type Value = typeof t.bigInt64;
			type Entry = readonly [Key, Value];

			const schema = new Schema(1).bigInt64('a');
			expectTypeOf<Schema<1, { a: Value }>>(schema);
			expect(schema.bitSize).toBe(64);

			expect<Key[]>([...schema.keys()]).toEqual(['a']);
			expect<Value[]>([...schema.values()]).toEqual([t.bigInt64]);
			expect<Entry[]>([...schema.entries()]).toEqual([['a', t.bigInt64]]);
		});

		it('given a schema with a bigUint64 property then it has the correct properties and types', () => {
			type Key = 'a';
			type Value = typeof t.bigUint64;
			type Entry = readonly [Key, Value];

			const schema = new Schema(1).bigUint64('a');
			expectTypeOf<Schema<1, { a: Value }>>(schema);
			expect(schema.bitSize).toBe(64);

			expect<Key[]>([...schema.keys()]).toEqual(['a']);
			expect<Value[]>([...schema.values()]).toEqual([t.bigUint64]);
			expect<Entry[]>([...schema.entries()]).toEqual([['a', t.bigUint64]]);
		});

		it('given a schema with a float32 property then it has the correct properties and types', () => {
			type Key = 'a';
			type Value = typeof t.float32;
			type Entry = readonly [Key, Value];

			const schema = new Schema(1).float32('a');
			expectTypeOf<Schema<1, { a: Value }>>(schema);
			expect(schema.bitSize).toBe(32);

			expect<Key[]>([...schema.keys()]).toEqual(['a']);
			expect<Value[]>([...schema.values()]).toEqual([t.float32]);
			expect<Entry[]>([...schema.entries()]).toEqual([['a', t.float32]]);
		});

		it('given a schema with a float64 property then it has the correct properties and types', () => {
			type Key = 'a';
			type Value = typeof t.float64;
			type Entry = readonly [Key, Value];

			const schema = new Schema(1).float64('a');
			expectTypeOf<Schema<1, { a: Value }>>(schema);
			expect(schema.bitSize).toBe(64);

			expect<Key[]>([...schema.keys()]).toEqual(['a']);
			expect<Value[]>([...schema.values()]).toEqual([t.float64]);
			expect<Entry[]>([...schema.entries()]).toEqual([['a', t.float64]]);
		});

		it('given a schema with a string property then it has the correct properties and types', () => {
			const schema = new Schema(1).string('a');
			expectTypeOf<Schema<1, { a: Value }>>(schema);
			expect(schema.bitSize).toBeNull();

			type Key = 'a';
			type Value = typeof StringType;
			type Entry = readonly [Key, Value];

			expect<Key[]>([...schema.keys()]).toEqual(['a']);
			expect<Value[]>([...schema.values()]).toEqual([StringType]);
			expect<Entry[]>([...schema.entries()]).toEqual([['a', StringType]]);
		});

		it('given a schema with a nullable property then it has the correct properties and types', () => {
			const schema = new Schema(1).nullable('a', t.bit);
			expectTypeOf<Schema<1, { a: Value }>>(schema);
			expect(schema.bitSize).toBe(null);
			type Key = 'a';
			type Value = IType<0 | 1 | null, null, 0 | 1 | null | undefined>;
			type Entry = readonly [Key, Value];
			const value = schema.get('a');
			expect<Key[]>([...schema.keys()]).toEqual(['a']);
			expect<Value[]>([...schema.values()]).toEqual([value]);
			expect<Entry[]>([...schema.entries()]).toEqual([['a', value]]);
		});

		it('given a schema with a snowflake property then it has the correct properties and types', () => {
			const schema = new Schema(1).snowflake('a');
			expectTypeOf<Schema<1, { a: Value }>>(schema);
			expect(schema.bitSize).toBe(64);

			type Key = 'a';
			type Value = typeof SnowflakeType;
			type Entry = readonly [Key, Value];

			expect<Key[]>([...schema.keys()]).toEqual(['a']);
			expect<Value[]>([...schema.values()]).toEqual([SnowflakeType]);
			expect<Entry[]>([...schema.entries()]).toEqual([['a', SnowflakeType]]);
		});

		it('given a schema with an array then it has the correct properties and types', () => {
			const schema = new Schema(1).array('a', t.bit);
			expectTypeOf<Schema<1, { a: Value }>>(schema);
			expect(schema.bitSize).toBeNull();

			type Key = 'a';
			type Value = IType<Array<0 | 1>, null, Array<0 | 1>>;
			type Entry = readonly [Key, Value];

			const value = schema.get('a');

			expect<Key[]>([...schema.keys()]).toEqual(['a']);
			expect<Value[]>([...schema.values()]).toEqual([value]);
			expect<Entry[]>([...schema.entries()]).toEqual([['a', value]]);
		});

		it('given a schema with a fixed-length array then it has the correct properties and types', () => {
			const schema = new Schema(1).fixedLengthArray('a', t.bit, 2);
			expectTypeOf<Schema<1, { a: Value }>>(schema);
			expect(schema.bitSize).toBe(2);

			type Key = 'a';
			type Value = IType<Array<0 | 1>, number, Array<0 | 1>>;
			type Entry = readonly [Key, Value];

			const value = schema.get('a');

			expect<Key[]>([...schema.keys()]).toEqual(['a']);
			expect<Value[]>([...schema.values()]).toEqual([value]);
			expect<Entry[]>([...schema.entries()]).toEqual([['a', value]]);
		});

		it('given a schema with a fixed-length array of an element with no length then it has the correct properties and types', () => {
			const schema = new Schema(1).fixedLengthArray('a', StringType, 2);
			expectTypeOf<Schema<1, { a: Value }>>(schema);
			expect(schema.bitSize).toBeNull();

			type Key = 'a';
			type Value = IType<string[], null>;
			type Entry = readonly [Key, Value];

			const value = schema.get('a');

			expect<Key[]>([...schema.keys()]).toEqual(['a']);
			expect<Value[]>([...schema.values()]).toEqual([value]);
			expect<Entry[]>([...schema.entries()]).toEqual([['a', value]]);
		});

		it('given a schema with a constant property then it has the correct properties and types', () => {
			const schema = new Schema(1).constant('a', 'Hello There!');
			expectTypeOf<Schema<1, { a: Value }>>(schema);
			expect(schema.bitSize).toBe(0);
			type Key = 'a';
			type Value = IType<'Hello There!', 0, never>;
			type Entry = readonly [Key, Value];
			const value = schema.get('a');
			expect<Key[]>([...schema.keys()]).toEqual(['a']);
			expect<Value[]>([...schema.values()]).toEqual([value]);
			expect<Entry[]>([...schema.entries()]).toEqual([['a', value]]);
		});
	});

	describe('serialization', () => {
		it('given a schema with a boolean property then it serializes correctly (serialize)', () => {
			const schema = new Schema(4).boolean('a').int16('b');
			const buffer = schema.serialize({ a: true, b: 15234 }, 3);
			// The buffer has 3 values:
			// - 4     (schema:id) & 0xffff (mask)
			//
			// - 1     (prop:a)    & 0b0001 (mask)
			// | 15234 (prop:b)    & 0xffff (mask) << 1 (offset)
			//
			// - 15234 (prop:b)    & 0xffff (mask) >> 15 (shift)
			expect(buffer).toBe('\x04\u{7705}\0');
			const value = schema.deserialize(buffer, 16);
			expect<{ a: boolean }>(value).toEqual({ a: true, b: 15234 });
		});

		it('given a schema with a boolean property then it serializes correctly (serializeRaw)', () => {
			const schema = new Schema(4).boolean('a').int16('b');
			const buffer = schema.serializeRaw({ a: true, b: 15234 }, 3);
			// The buffer has 3 values:
			// - 4     (schema:id) & 0xffff (mask)
			//
			// - 1     (prop:a)    & 0b0001 (mask)
			// | 15234 (prop:b)    & 0xffff (mask) << 1 (offset)
			//
			// - 15234 (prop:b)    & 0xffff (mask) >> 15 (shift)
			expect(buffer.toArray()).toEqual(new Uint16Array([4, 30469, 0]));
			const value = schema.deserialize(buffer, 16);
			expect<{ a: boolean }>(value).toEqual({ a: true, b: 15234 });
		});

		it('given a schema with a boolean property then it serializes correctly (serializeInto)', () => {
			const buffer = new UnalignedUint16Array(3);
			const schema = new Schema(4).boolean('a').int16('b');
			schema.serializeInto(buffer, { a: true, b: 15234 });
			// The buffer has 3 values:
			// - 4     (schema:id) & 0xffff (mask)
			//
			// - 1     (prop:a)    & 0b0001 (mask)
			// | 15234 (prop:b)    & 0xffff (mask) << 1 (offset)
			//
			// - 15234 (prop:b)    & 0xffff (mask) >> 15 (shift)
			expect(buffer.toArray()).toEqual(new Uint16Array([4, 30469, 0]));

			const value = schema.deserialize(buffer, 16);
			expect<{ a: boolean }>(value).toEqual({ a: true, b: 15234 });
		});
	});

	describe('exceptions', () => {
		it('given a schema with a duplicate property then it throws', () => {
			const schema = new Schema(1).boolean('a');
			expect(() => schema.boolean('a')).toThrowError('Schema with id 1 already has a property with name "a"');
		});

		it('given a schema with a non-existent property name then it throws', () => {
			const schema = new Schema(1).boolean('a');
			// @ts-expect-error: Testing invalid input
			expect(() => schema.get('b')).toThrowError('Schema with id 1 does not have a property with name "b"');
		});
	});
});
