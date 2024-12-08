import type { Float64Type } from '../src';
import { Schema, SchemaStore, UnalignedUint16Array } from '../src';

describe('schemaStore', () => {
	it('given an empty SchemaStore then it should be empty', () => {
		const store = new SchemaStore();
		expectTypeOf<SchemaStore>(store);
		expect(store.defaultMaximumArrayLength).toBe(100);

		type Key = string;
		type Value = never;
		type Entry = readonly [Key, Value];

		expect<Key[]>([...store.keys()]).toEqual([]);
		expect<Value[]>([...store.values()]).toEqual([]);
		expect<Entry[]>([...store.entries()]).toEqual([]);
		expect<Entry[]>([...store]).toEqual([]);
	});

	it('given a SchemaStore with a Schema then it has the correct properties and types', () => {
		const schema = new Schema(2).float64('height');
		const store = new SchemaStore().add(schema);
		expectTypeOf<SchemaStore<{ 2: Schema<2, { height: typeof Float64Type }> }>>(store);

		expect<typeof schema>(store.get(2)).toBe(schema);
	});

	describe('serialization', () => {
		it('given a schema and a value then it serializes and deserializes the buffer correctly', () => {
			const store = new SchemaStore(10).add(new Schema(2).string('name').float64('height'));

			const buffer = store.serialize(2, { name: 'Mario', height: 1.8 });
			const deserialized = store.deserialize(buffer);
			expect<{ id: 2; data: { height: number } }>(deserialized).toEqual({ id: 2, data: { name: 'Mario', height: 1.8 } });

			expect<2>(store.getIdentifier(buffer)).toBe(2);
			expect<2>(store.getIdentifier(buffer.toString())).toBe(2);
		});

		it('given a schema and a value then it serializes and deserializes the binary string correctly', () => {
			const store = new SchemaStore(10).add(new Schema(2).string('name').float64('height'));

			const buffer = store.serialize(2, { name: 'Mario', height: 1.8 });
			const deserialized = store.deserialize(buffer.toString());
			expect<{ id: 2; data: { height: number } }>(deserialized).toEqual({ id: 2, data: { name: 'Mario', height: 1.8 } });

			expect<2>(store.getIdentifier(buffer)).toBe(2);
			expect<2>(store.getIdentifier(buffer.toString())).toBe(2);
		});
	});

	describe('exceptions', () => {
		it('given a schema ID that already exists then it throws', () => {
			const schema = new Schema(2).float64('height');
			const store = new SchemaStore().add(schema);
			expect(() => store.add(schema)).toThrowError('Schema with id 2 already exists');
		});

		it('given a schema ID that does not exist then it throws', () => {
			const store = new SchemaStore();
			// @ts-expect-error: Testing invalid input
			expect(() => store.get(2)).toThrowError('Schema with id 2 does not exist');
		});

		it.each(['', UnalignedUint16Array.from('')])('given an empty value to `getIdentifier` then it throws', (value) => {
			const store = new SchemaStore();
			expect(() => store.getIdentifier(value)).toThrowError('Expected a non-empty value');
		});
	});
});
