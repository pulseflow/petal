import type { Schema, SerializeValue, UnwrapSchema } from './Schema.ts';
import { Pointer } from './Pointer.ts';
import { UnalignedUint16Array } from './types/base/UnalignedUint16Array.ts';

export class SchemaStore<Entries extends object = object> {
	/**
	 * The default maximum array length for schemas
	 */
	public defaultMaximumArrayLength: number;

	readonly #schemas: Map<number, Schema> = new Map();

	/**
	 * Creates a new schema store
	 *
	 * @param defaultMaximumArrayLength The default maximum array length for schemas
	 */
	public constructor(defaultMaximumArrayLength = 100) {
		this.defaultMaximumArrayLength = defaultMaximumArrayLength;
	}

	/**
	 * Adds a schema to the store
	 *
	 * @param schema The schema to add to the store
	 * @returns The modified store
	 *
	 * @remarks
	 *
	 * An error will be thrown if a schema with the same id already exists in the store.
	 */
	public add<const Id extends number, const SchemaType extends object>(schema: Schema<Id, SchemaType>): Merge<Entries, Id, typeof schema> {
		if (this.#schemas.has(schema.id))
			throw new Error(`Schema with id ${schema.id} already exists`);

		this.#schemas.set(schema.id, schema as any);
		return this as unknown as Merge<Entries, Id, typeof schema>;
	}

	/**
	 * Gets a schema from the store
	 *
	 * @param id The id of the schema to get
	 * @returns The schema with the given id
	 *
	 * @remarks
	 *
	 * An error will be thrown if a schema with the given id does not exist in the store.
	 */
	public get<const Id extends KeyOfStore<this>>(id: Id): Entries[Id] {
		const schema = this.#schemas.get(id) as Entries[Id];
		if (!schema)
			throw new Error(`Schema with id ${id} does not exist`);
		return schema;
	}

	/**
	 * Serializes a value using the schema with the given id
	 *
	 * @param id The id of the schema to use for serialization
	 * @param value The value to serialize
	 * @returns The serialized buffer
	 */
	public serialize<const Id extends KeyOfStore<this>>(id: Id, value: SerializeValue<Entries[Id] & object>): UnalignedUint16Array {
		const schema = this.get(id) as Schema<Id>;
		const buffer = new UnalignedUint16Array(schema.totalBitSize ?? this.defaultMaximumArrayLength);
		schema.serialize(buffer, value);
		return buffer;
	}

	/**
	 * Deserializes a buffer
	 *
	 * @param buffer The buffer to deserialize
	 * @returns The resolved value, including the id of the schema used for deserialization
	 */
	public deserialize(buffer: string | UnalignedUint16Array): DeserializationResult<Entries> {
		buffer = UnalignedUint16Array.from(buffer);
		const pointer = new Pointer();
		const id = buffer.readInt16(pointer) as KeyOfStore<this>;
		const schema = this.get(id) as Schema;
		return { id, data: schema.deserialize(buffer, pointer) } as unknown as DeserializationResult<Entries>;
	}

	/**
	 * Gets the serialized ID from a buffer
	 *
	 * @param buffer The buffer to read the ID from
	 * @returns The deserialized ID
	 *
	 * @remarks
	 *
	 * If an empty value is passed, a {@linkcode RangeError} will be thrown.
	 */
	// eslint-disable-next-line ts/class-methods-use-this -- complex buffer
	public getIdentifier(buffer: string | UnalignedUint16Array): KeyOfStore<this> {
		if (buffer.length === 0)
			throw new RangeError('Expected a non-empty value');

		if (typeof buffer === 'string')
			buffer = UnalignedUint16Array.from(buffer[0]);

		return buffer.at(0) as KeyOfStore<this>;
	}

	/**
	 * Iterates over the stores's schema identifiers.
	 *
	 * @returns An iterator for the stores's schema identifiers
	 */
	public keys(): IterableIterator<KeyOfStore<this>> {
		return this.#schemas.keys() as IterableIterator<KeyOfStore<this>>;
	}

	/**
	 * Iterates over the stores's schemas.
	 *
	 * @returns An iterator for the stores's schemas
	 */
	public values(): IterableIterator<ValueOfStore<this>> {
		return this.#schemas.values() as IterableIterator<ValueOfStore<this>>;
	}

	/**
	 * Iterates over the stores's schema entries.
	 *
	 * @returns An iterator for the stores's schema entries
	 */
	public entries(): IterableIterator<EntryOfStore<this>> {
		return this.#schemas.entries() as IterableIterator<EntryOfStore<this>>;
	}

	/**
	 * Iterates over the stores's schema entries.
	 *
	 * @returns An iterator for the stores's schema entries
	 */
	public [Symbol.iterator](): IterableIterator<EntryOfStore<this>> {
		return this.entries();
	}
}

type Merge<Entries extends object, Id extends number, Type extends object> = Id extends keyof Entries ? never : SchemaStore<{ [K in Id | keyof Entries]: K extends keyof Entries ? Entries[K] : Type }>;
export type KeyOfStore<SchemaStoreValue extends object> = SchemaStoreValue extends SchemaStore<infer Schemas> ? keyof Schemas & number : never;
export type ValueOfStore<SchemaStoreValue extends object> = SchemaStoreValue extends SchemaStore<infer Schemas> ? Schemas[keyof Schemas & number] : never;
export type EntryOfStore<SchemaStoreValue extends object> = SchemaStoreValue extends SchemaStore<infer Schemas> ? { [K in keyof Schemas]: readonly [K & number, Schemas[K]] }[keyof Schemas] : never;
export type DeserializationResult<SchemaStoreEntries extends object> = { [K in keyof SchemaStoreEntries]: { id: K; data: UnwrapSchema<SchemaStoreEntries[K] & object> }; }[keyof SchemaStoreEntries];
