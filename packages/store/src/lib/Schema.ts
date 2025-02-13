import type { PointerLike } from './Pointer.ts';
import type { DuplexBuffer } from './types/base/DuplexBuffer.ts';
import type { IType } from './types/index.ts';
import { Pointer } from './Pointer.ts';
import { UnalignedUint16Array } from './types/base/UnalignedUint16Array.ts';
import { t } from './types/index.ts';

export class Schema<Id extends number = number, Entries extends object = object> {
	readonly #id: Id;
	readonly #types: Map<string, IType<any, number | null>> = new Map();
	#bitSize: number | null = 0;

	/**
	 * Creates a new schema.
	 *
	 * @param id The id of the schema
	 */
	public constructor(id: Id) {
		this.#id = id;
	}

	/**
	 * The id of the schema.
	 */
	public get id(): Id {
		return this.#id;
	}

	/**
	 * The bit size of the entries in the schema.
	 *
	 * @remarks
	 *
	 * If any of the entries have a bit size of `null`, the bit size of the
	 * schema will also be `null`.
	 */
	public get bitSize(): number | null {
		return this.#bitSize;
	}

	/**
	 * The total bit size of the entries in the schema and the ID.
	 *
	 * @remarks
	 *
	 * If any of the entries have a bit size of `null`, the total bit size of
	 * the schema will also be `null`.
	 */
	public get totalBitSize(): number | null {
		return this.#bitSize === null ? null : this.#bitSize + 16;
	}

	/**
	 * Get a property from the schema.
	 *
	 * @param name The name of the property
	 * @returns The specified property
	 *
	 * @remarks
	 *
	 * If the property does not exist, an error will be thrown.
	 */
	public get<const Name extends keyof Entries & string>(name: Name): Entries[Name] {
		const type = this.#types.get(name) as Entries[Name];
		if (!type)
			throw new Error(`Schema with id ${this.#id} does not have a property with name "${name}"`);
		return type;
	}

	/**
	 * Create a buffer and serialize a value into it, then convert it to a string
	 *
	 * @param value The value to serialize into the buffer
	 * @param defaultMaximumArrayLength The default maximum array length, if any
	 * @returns The newly created string.
	 *
	 * @seealso This method calls {@link Schema.serializeRaw} before calling `toString()` to its result.
	 */
	public serialize(value: Readonly<SerializeValueEntries<Entries>>, defaultMaximumArrayLength = 100): string {
		return this.serializeRaw(value, defaultMaximumArrayLength).toString();
	}

	/**
	 * Create a buffer and serialize a value into it.
	 *
	 * @param value The value to serialize into the buffer
	 * @param defaultMaximumArrayLength The default maximum array length, if any
	 * @returns The newly created buffer.
	 */
	public serializeRaw(value: Readonly<SerializeValueEntries<Entries>>, defaultMaximumArrayLength = 100): DuplexBuffer {
		const buffer = new UnalignedUint16Array(this.totalBitSize ?? defaultMaximumArrayLength);
		this.serializeInto(buffer, value);
		return buffer;
	}

	/**
	 * Serialize a value into a buffer.
	 *
	 * @param buffer The buffer to serialize
	 * @param value The value to serialize into the buffer
	 *
	 * @remarks
	 *
	 * The schema's ID is written to the buffer first, followed by each property
	 * in the schema.
	 */
	public serializeInto(buffer: DuplexBuffer, value: Readonly<SerializeValueEntries<Entries>>): void {
		buffer.writeInt16(this.#id);
		for (const [name, type] of this)
			(type as IType<any, number | null>).serialize(buffer, (value as any)[name]);
	}

	/**
	 * Deserialize a value from a buffer.
	 *
	 * @param buffer The buffer to deserialize
	 * @param pointer The pointer to where the buffer should be read from
	 * @returns The deserialized value
	 *
	 * @remarks
	 *
	 * Unlike {@link Schema.serializeInto}, this method does not read the schema's ID
	 * from the buffer, that is reserved for the {@link SchemaStore}.
	 */
	public deserialize(buffer: DuplexBuffer | string, pointer: PointerLike): UnwrapSchemaEntries<Entries> {
		buffer = UnalignedUint16Array.from(buffer);
		pointer = Pointer.from(pointer);
		const result = Object.create(null) as UnwrapSchemaEntries<Entries>;
		for (const [name, type] of this)
			// @ts-expect-error: Complex types
			// eslint-disable-next-line ts/no-unsafe-call -- complex types
			result[name] = type.deserialize(buffer, pointer);

		return result;
	}

	/**
	 * Adds an array property to the schema.
	 *
	 * @seealso {@link Schema.fixedLengthArray} for a fixed length array
	 *
	 * @param name The name of the property
	 * @param type The type of the entry in the array
	 * @returns The modified schema
	 */
	public array<const Name extends string, const ValueType, const ValueBitSize extends number | null>(
		name: Name,
		type: IType<ValueType, ValueBitSize>,
	): Merge<Id, Entries, Name, IType<ValueType[], null, ValueType[]>> {
		return this.#addType(name, t.array(type));
	}

	/**
	 * Adds a fixed length array property to the schema.
	 *
	 * @seealso {@link Schema.array} for a dynamic length array
	 *
	 * @param name The name of the property
	 * @param type The type of the entry in the array
	 * @param length The length of the array
	 * @returns The modified schema
	 */
	public fixedLengthArray<const Name extends string, const ValueType, const ValueBitSize extends number | null>(
		name: Name,
		type: IType<ValueType, ValueBitSize>,
		length: number,
	): Merge<Id, Entries, Name, IType<ValueType[], ValueBitSize extends null ? null : number, ValueType[]>> {
		return this.#addType(name, t.fixedLengthArray(type, length));
	}

	/**
	 * Adds a string property to the schema.
	 *
	 * @param name The name of the property
	 * @returns The modified schema
	 */
	public string<const Name extends string>(name: Name): Merge<Id, Entries, Name, IType<string, null, string>> {
		return this.#addType(name, t.string);
	}

	/**
	 * Adds a boolean property to the schema.
	 *
	 * @param name The name of the property
	 * @returns The modified schema
	 */
	public boolean<const Name extends string>(name: Name): Merge<Id, Entries, Name, IType<boolean, 1, boolean>> {
		return this.#addType(name, t.boolean);
	}

	/**
	 * Adds a bit property to the schema.
	 *
	 * @param name The name of the property
	 * @returns The modified schema
	 */
	public bit<const Name extends string>(name: Name): Merge<Id, Entries, Name, IType<0 | 1, 1, number>> {
		return this.#addType(name, t.bit);
	}

	/**
	 * Adds a 2-bit integer property to the schema.
	 *
	 * @remarks
	 *
	 * The range of values is from -2 to 1, inclusive.
	 *
	 * @param name The name of the property
	 * @returns The modified schema
	 */
	public int2<const Name extends string>(name: Name): Merge<Id, Entries, Name, IType<number, 2, number>> {
		return this.#addType(name, t.int2);
	}

	/**
	 * Adds a 2-bit unsigned integer property to the schema.
	 *
	 * @remarks
	 *
	 * The range of values is from 0 to 3, inclusive.
	 *
	 * @param name The name of the property
	 * @returns The modified schema
	 */
	public uint2<const Name extends string>(name: Name): Merge<Id, Entries, Name, IType<number, 2, number>> {
		return this.#addType(name, t.uint2);
	}

	/**
	 * Adds a 4-bit integer property to the schema.
	 *
	 * @remarks
	 *
	 * The range of values is from -8 to 7, inclusive.
	 *
	 * @param name The name of the property
	 * @returns The modified schema
	 */
	public int4<const Name extends string>(name: Name): Merge<Id, Entries, Name, IType<number, 4, number>> {
		return this.#addType(name, t.int4);
	}

	/**
	 * Adds a 4-bit unsigned integer property to the schema.
	 *
	 * @remarks
	 *
	 * The range of values is from 0 to 15, inclusive.
	 *
	 * @param name The name of the property
	 * @returns The modified schema
	 */
	public uint4<const Name extends string>(name: Name): Merge<Id, Entries, Name, IType<number, 4, number>> {
		return this.#addType(name, t.uint4);
	}

	/**
	 * Adds a 8-bit integer property to the schema.
	 *
	 * @remarks
	 *
	 * The range of values is from -128 to 127, inclusive.
	 *
	 * @param name The name of the property
	 * @returns The modified schema
	 */
	public int8<const Name extends string>(name: Name): Merge<Id, Entries, Name, IType<number, 8, number>> {
		return this.#addType(name, t.int8);
	}

	/**
	 * Adds a 8-bit unsigned integer property to the schema.
	 *
	 * @remarks
	 *
	 * The range of values is from 0 to 255, inclusive.
	 *
	 * @param name The name of the property
	 * @returns The modified schema
	 */
	public uint8<const Name extends string>(name: Name): Merge<Id, Entries, Name, IType<number, 8, number>> {
		return this.#addType(name, t.uint8);
	}

	/**
	 * Adds a 16-bit integer property to the schema.
	 *
	 * @remarks
	 *
	 * The range of values is from -32768 to 32767, inclusive.
	 *
	 * @param name The name of the property
	 * @returns The modified schema
	 */
	public int16<const Name extends string>(name: Name): Merge<Id, Entries, Name, IType<number, 16, number>> {
		return this.#addType(name, t.int16);
	}

	/**
	 * Adds a 16-bit unsigned integer property to the schema.
	 *
	 * @remarks
	 *
	 * The range of values is from 0 to 65535, inclusive.
	 *
	 * @param name The name of the property
	 * @returns The modified schema
	 */
	public uint16<const Name extends string>(name: Name): Merge<Id, Entries, Name, IType<number, 16, number>> {
		return this.#addType(name, t.uint16);
	}

	/**
	 * Adds a 32-bit integer property to the schema.
	 *
	 * @remarks
	 *
	 * The range of values is from -2_147_483_648 to 2_147_483_647, inclusive.
	 *
	 * @param name The name of the property
	 * @returns The modified schema
	 */
	public int32<const Name extends string>(name: Name): Merge<Id, Entries, Name, IType<number, 32, number>> {
		return this.#addType(name, t.int32);
	}

	/**
	 * Adds a 32-bit unsigned integer property to the schema.
	 *
	 * @remarks
	 *
	 * The range of values is from 0 to 4_294_967_295, inclusive.
	 *
	 * @param name The name of the property
	 * @returns The modified schema
	 */
	public uint32<const Name extends string>(name: Name): Merge<Id, Entries, Name, IType<number, 32, number>> {
		return this.#addType(name, t.uint32);
	}

	/**
	 * Adds a 64-bit integer property to the schema.
	 *
	 * @remarks
	 *
	 * The range of values is from -9_223_372_036_854_775_808 to 9_223_372_036_854_775_807, inclusive.
	 *
	 * However, it may run into precision issues past the range of `-9_007_199_254_740_991` to `9_007_199_254_740_991`
	 *
	 * @param name The name of the property
	 * @returns The modified schema
	 */
	public int64<const Name extends string>(name: Name): Merge<Id, Entries, Name, IType<number, 64, number>> {
		return this.#addType(name, t.int64);
	}

	/**
	 * Adds a 64-bit unsigned integer property to the schema.
	 *
	 * @remarks
	 *
	 * The range of values is from 0 to 18_446_744_073_709_551_615, inclusive.
	 *
	 * However, it may run into precision issues past `9_007_199_254_740_991`
	 *
	 * @param name The name of the property
	 * @returns The modified schema
	 */
	public uint64<const Name extends string>(name: Name): Merge<Id, Entries, Name, IType<number, 64, number>> {
		return this.#addType(name, t.uint64);
	}

	/**
	 * Adds a 32-bit big integer property to the schema.
	 *
	 * @remarks
	 *
	 * The range of values is from -2_147_483_648n to 2_147_483_647n, inclusive.
	 *
	 * @param name The name of the property
	 * @returns The modified schema
	 */
	public bigInt32<const Name extends string>(name: Name): Merge<Id, Entries, Name, IType<bigint, 32, bigint>> {
		return this.#addType(name, t.bigInt32);
	}

	/**
	 * Adds a 32-bit big integer property to the schema.
	 *
	 * @remarks
	 *
	 * The range of values is from 0n to 4_294_967_295n, inclusive.
	 *
	 * @param name The name of the property
	 * @returns The modified schema
	 */
	public bigUint32<const Name extends string>(name: Name): Merge<Id, Entries, Name, IType<bigint, 32, bigint>> {
		return this.#addType(name, t.bigUint32);
	}

	/**
	 * Adds a 64-bit big integer property to the schema.
	 *
	 * @remarks
	 *
	 * The range of values is from -9_223_372_036_854_775_808n to 9_223_372_036_854_775_807n, inclusive.
	 *
	 * @param name The name of the property
	 * @returns The modified schema
	 */
	public bigInt64<const Name extends string>(name: Name): Merge<Id, Entries, Name, IType<bigint, 64, bigint>> {
		return this.#addType(name, t.bigInt64);
	}

	/**
	 * Adds a 64-bit big integer property to the schema.
	 *
	 * @remarks
	 *
	 * The range of values is from 0n to 18_446_744_073_709_551_615n, inclusive.
	 *
	 * @param name The name of the property
	 * @returns The modified schema
	 */
	public bigUint64<const Name extends string>(name: Name): Merge<Id, Entries, Name, IType<bigint, 64, bigint>> {
		return this.#addType(name, t.bigUint64);
	}

	/**
	 * Adds a 32-bit floating point number property to the schema.
	 *
	 * @remarks
	 *
	 * The range of values is from -3.4028234663852886e+38 to 3.4028234663852886e+38, inclusive.
	 *
	 * @param name The name of the property
	 * @returns The modified schema
	 */
	public float32<const Name extends string>(name: Name): Merge<Id, Entries, Name, IType<number, 32, number>> {
		return this.#addType(name, t.float32);
	}

	/**
	 * Adds a 64-bit floating point number property to the schema.
	 *
	 * @remarks
	 *
	 * The range of values is from -1.7976931348623157e+308 to 1.7976931348623157e+308, inclusive.
	 *
	 * @param name The name of the property
	 * @returns The modified schema
	 */
	public float64<const Name extends string>(name: Name): Merge<Id, Entries, Name, IType<number, 64, number>> {
		return this.#addType(name, t.float64);
	}

	/**
	 * Adds a nullable property to the schema.
	 *
	 * @param name The name of the property
	 * @param type The type of the underlying value
	 * @returns The modified schema
	 */
	public nullable<const Name extends string, const ValueType, const ValueBitSize extends number | null>(
		name: Name,
		type: IType<ValueType, ValueBitSize>,
	): Merge<Id, Entries, Name, IType<ValueType | null, null, ValueType | null | undefined>> {
		return this.#addType(name, t.nullable(type));
	}

	/**
	 * Adds a 64-bit big integer property to the schema, similar to {@link Schema.bigUint64}.
	 *
	 * @remarks
	 *
	 * The range of values is from 0n to 18_446_744_073_709_551_615n, inclusive.
	 *
	 * @param name The name of the property
	 * @returns The modified schema
	 */
	public snowflake<const Name extends string>(name: Name): Merge<Id, Entries, Name, IType<bigint, 64, string | bigint>> {
		return this.#addType(name, t.snowflake);
	}

	/**
	 * Adds a constant value in the schema, this will **not** be serialized and
	 * can be used to add extra data without making the payload bigger.
	 *
	 * @param name The name of the property
	 * @param constantValue The value to add to the schema
	 * @returns The modified schema
	 */
	// eslint-disable-next-line ts/explicit-function-return-type, ts/explicit-module-boundary-types -- not sure why
	public constant<const Name extends string, const ValueType>(name: Name, constantValue: ValueType) {
		return this.#addType(name, t.constant(constantValue));
	}

	/**
	 * Iterates over the schema's property names.
	 *
	 * @returns An iterator for the schema's property names
	 */
	public keys(): IterableIterator<KeyOfSchema<this>> {
		return this.#types.keys() as IterableIterator<KeyOfSchema<this>>;
	}

	/**
	 * Iterates over the schema's property values
	 *
	 * @returns An iterator for the schema's property values
	 */
	public values(): IterableIterator<ValueOfSchema<this>> {
		return this.#types.values() as IterableIterator<ValueOfSchema<this>>;
	}

	/**
	 * Iterates over the schema's property entries
	 *
	 * @returns An iterator for the schema's property entries
	 */
	public entries(): IterableIterator<EntryOfSchema<this>> {
		return this.#types.entries() as IterableIterator<EntryOfSchema<this>>;
	}

	/**
	 * Iterates over the schema's property entries
	 *
	 * @returns An iterator for the schema's property entries
	 */
	public [Symbol.iterator](): IterableIterator<EntryOfSchema<this>> {
		return this.entries();
	}

	#addType<const EntryName extends string, const ValueType, const ValueBitSize extends number | null, InputValue>(
		name: EntryName,
		type: IType<ValueType, ValueBitSize, InputValue>,
	): Merge<Id, Entries, EntryName, typeof type> {
		if (this.#types.has(name))
			throw new Error(`Schema with id ${this.#id} already has a property with name "${name}"`);

		this.#types.set(name, type);

		if (type.BIT_SIZE === null)
			this.#bitSize = null;
		else if (this.#bitSize !== null)
			this.#bitSize += type.BIT_SIZE;

		return this as unknown as Merge<Id, Entries, EntryName, typeof type>;
	}
}

type Merge<Id extends number, Entries extends object, EntryName extends string, EntryType extends IType<any, number | null>> = EntryName extends keyof Entries ? never : Schema<Id, { [K in EntryName | keyof Entries]: K extends keyof Entries ? Entries[K] : EntryType }>;
export type KeyOfSchema<SchemaValue extends object> = SchemaValue extends Schema<infer _, infer Type> ? keyof Type & string : never;
export type ValueOfSchema<SchemaValue extends object> = SchemaValue extends Schema<infer _, infer Type> ? { [K in keyof Type]: Type[K] }[keyof Type] : never;
export type EntryOfSchema<SchemaValue extends object> = SchemaValue extends Schema<infer _, infer Type> ? { [K in keyof Type]: readonly [K, Type[K]] }[keyof Type] : never;
export type UnwrapSchemaType<Type extends object> = Type extends IType<infer ValueType, infer _BitSize, infer _InputType> ? ValueType : never;
export type UnwrapSchemaEntries<Entries extends object> = { [K in keyof Entries]: UnwrapSchemaType<Entries[K] & object> } & object;
export type UnwrapSchema<SchemaValue extends object> = SchemaValue extends Schema<infer _Id, infer Type> ? UnwrapSchemaEntries<Type> : never;
type OmitNever<T> = { [K in keyof T as T[K] extends never ? never : K]: T[K] };
export type SerializeValueType<Type extends object> = Type extends IType<infer _ValueType, infer _BitSize, infer InputType> ? InputType : never;
export type SerializeValueEntries<Entries extends object> = OmitNever<{ [K in keyof Entries]: SerializeValueType<Entries[K] & object> }>;
export type SerializeValue<SchemaValue extends object> = SchemaValue extends Schema<infer _Id, infer Type> ? SerializeValueEntries<Type> : never;
