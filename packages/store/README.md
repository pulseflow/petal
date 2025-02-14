# @flowr/store

**High-capacity fast raw data storage in UTF-16 strings.**

## Installation

You can use the following command to install this package, or replace `pnpm add` with your package manager of choice.

```sh
pnpm add
```

## Usage

```ts
// Require the store classes
import { Schema, SchemaStore, t } from '@flowr/store';

// Define the enum with the IDs and export it
export const Id = Object.freeze({
	AgeUpdate: 0,
	StrengthUpdate: 1,
	Planet: 2,
	User: 3
});

// Create the store in a file and export it
export const store = new SchemaStore()
	// Add a schema with an age field stored as a int32:
	// Schema<Id.AgeUpdate, { age: number }>
	.add(new Schema(Id.AgeUpdate).int32('age'))
	// Add a schema with a strength field stored as a float32:
	// Schema<Id.StrengthUpdate, { strength: number }>
	.add(new Schema(Id.StrengthUpdate).float32('strength'));

// Serialize an `Id.AgeUpdate` object into a string containing:
// - The schema ID (0)
// - The age field (20)
const buffer = store.serialize(Id.AgeUpdate, { age: 20 }).toString();
```

> [!Important]
> The IDs passed in the `Schema` constant need to be known at compile time, this can be done in the following ways:
>
> -   (TS) An `enum` object, which has all of its members strictly typed.
> -   (TS) An object with `as const`, which makes the values known at compile time.
> -   An object with `Object.freeze` as shown in the example, which is equivalent as the previous.
> -   An object with a JSDoc defining the types as the specific values.
> -   Multiple `const`ants for each value, or
>     -   (TS) Class fields marked as `readonly`.

> [!Tip]
> The serialized string is encoded in UTF-16, meaning it can store 16 bits per character. Each type stores a different number of bits, for example, a single character can store:
>
> -   16 booleans
> -   8 2-bit unsigned integers (0-3)
> -   4 4-bit unsigned integers (0-15)
> -   2 8-bit unsigned integers (0-255)
> -   1 16-bit integer (0-65535)
>
> As a use-case, Discord's `custom_id` field in message components can store up to **100** UTF-16 characters, which means it has a storage of **1600 bits**, below you can see the supported types and their storage in bits. Keep in mind that the schema ID is stored as a [16-bit](#int16) integer, and that the property names are **not** stored.

The schema can be defined using the following methods:

### `array`

Adds an array with a dynamic length to the schema.

```ts
// A schema with a single field `names` that is an array of strings:

const schema = new Schema(Id.Planets).array('names', t.string);
// → Schema<Id.Planets, { names: string[] }>
```

To track the length of the array, it will serialize a [16-bit](#int16) unsigned integer before the array.

### `fixedLengthArray`

An alternative to [`array`](#array) that has a fixed length. This variant requires the exact number of elements to be
serialized, but it will save space by not storing the length of the array.

```ts
// A schema with a single field `names` that is an array of exactly 3 strings:

const schema = new Schema(Id.Planets).fixedLengthArray('names', t.string, 3);
// → Schema<Id.Planets, { names: [string, string, string] }>
```

### `nullable`

Adds a nullable property of the specified type to the schema.

```ts
// A schema with a single field `capitalId` that is a nullable string:

const schema = new Schema(Id.Planets).nullable('capitalId', t.uint32);
// → Schema<Id.Planets, { capitalId: number | null }>
```

To track whether or not a property is optional, it will serialize a [bit](#bit), which signals whether or not the value
is defined, due to this, its bit size is `null`.

### `string`

Adds a string to the schema.

```ts
// A schema with a single field `name` that is a string:

const schema = new Schema(Id.Planet).string('name');
// → Schema<Id.Planets, { name: string }>
```

The string is serialized as UTF-8, and the length is serialized as a [16-bit](#int16) unsigned integer before the string.

### `boolean`

Adds a boolean (single bit) to the schema.

```ts
// A schema with a single field `isHabitable` that is a boolean:

const schema = new Schema(Id.Planet).boolean('isHabitable');
// → Schema<Id.Planets, { isHabitable: boolean }>
```

### `bit`

Adds a bit (0 or 1) to the schema. This is a numeric version of [`boolean`](#boolean).

```ts
// A schema with a single field `isHabitable` that is a bit:

const schema = new Schema(Id.Planet).bit('isHabitable');
// → Schema<Id.Planets, { isHabitable: 0 | 1 }>
```

### `int2`

Adds a 2-bit signed integer to the schema. It can store values from -2 to 1, inclusive.

```ts
// A schema with a single field `type` that is a 2-bit signed integer:

const schema = new Schema(Id.Planet).int2('type');
// → Schema<Id.Planets, { type: -2 | -1 | 0 | 1 }>
```

### `uint2`

Adds a 2-bit unsigned integer to the schema. It can store values from 0 to 3, inclusive.

```ts
// A schema with a single field `type` that is a 2-bit unsigned integer:

const schema = new Schema(Id.Planet).uint2('type');
// → Schema<Id.Planets, { type: 0 | 1 | 2 | 3 }>
```

### `int4`

Adds a 4-bit signed integer to the schema. It can store values from -8 to 7, inclusive.

```ts
// A schema with a single field `type` that is a 4-bit signed integer:

const schema = new Schema(Id.Planet).int4('type');
// → Schema<Id.Planets, { type: -8..=7 }>
```

### `uint4`

Adds a 4-bit unsigned integer to the schema. It can store values from 0 to 15, inclusive.

```ts
// A schema with a single field `type` that is a 4-bit unsigned integer:

const schema = new Schema(Id.Planet).uint4('type');
// → Schema<Id.Planets, { type: 0..=15 }>
```

### `int8`

Adds an 8-bit signed integer to the schema. It can store values from -128 to 127, inclusive.

```ts
// A schema with a single field `type` that is an 8-bit signed integer:

const schema = new Schema(Id.Planet).int8('type');
// → Schema<Id.Planets, { type: -128..=127 }>
```

### `uint8`

Adds an 8-bit unsigned integer to the schema. It can store values from 0 to 255, inclusive.

```ts
// A schema with a single field `type` that is an 8-bit unsigned integer:

const schema = new Schema(Id.Planet).uint8('type');
// → Schema<Id.Planets, { type: 0..=255 }>
```

### `int16`

Adds a 16-bit signed integer to the schema. It can store values from -32768 to 32767, inclusive.

```ts
// A schema with a single field `type` that is a 16-bit signed integer:

const schema = new Schema(Id.Planet).int16('type');
// → Schema<Id.Planets, { type: -32768..=32767 }>
```

### `uint16`

Adds a 16-bit unsigned integer to the schema. It can store values from 0 to 65535, inclusive.

```ts
// A schema with a single field `type` that is a 16-bit unsigned integer:

const schema = new Schema(Id.Planet).uint16('type');
// → Schema<Id.Planets, { type: 0..=65535 }>
```

### `int32`

Adds a 32-bit signed integer to the schema. It can store values from 2,147,483,648 to 2,147,483,647, inclusive.

```ts
// A schema with a single field `type` that is a 32-bit signed integer:

const schema = new Schema(Id.Planet).int32('type');
// → Schema<Id.Planets, { type: 2_147_483_648..=2_147_483_647 }>
```

### `uint32`

Adds a 32-bit unsigned integer to the schema. It can store values from 0 to 4,294,967,295, inclusive.

```ts
// A schema with a single field `type` that is a 32-bit unsigned integer:

const schema = new Schema(Id.Planet).uint32('type');
// → Schema<Id.Planets, { type: 0..=4294967295 }>
```

### `int64`

Adds a 64-bit signed integer to the schema. It can store values from -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807, inclusive.

**Note**: values smaller than `Number.MIN_SAFE_INTEGER` or larger than `Number.MAX_SAFE_INTEGER` will lose precision, if you need to store larger numbers, consider using [`bigInt64`](#bigint64).

```ts
// A schema with a single field `type` that is a 64-bit signed integer:

const schema = new Schema(Id.Planet).int64('type');
// → Schema<Id.Planets, { type: -9_223_372_036_854_775_808..=9_223_372_036_854_775_807 }>
```

### `uint64`

Adds a 64-bit unsigned integer to the schema. It can store values from 0 to 18,446,744,073,709,551,615, inclusive.

**Note**: values larger than 9,007,199,254,740,991 (`Number.MAX_SAFE_INTEGER`) will lose precision, if you need to store larger numbers, use [`bigUint64`](#bigUint64).

```ts
// A schema with a single field `type` that is a 64-bit unsigned integer:

const schema = new Schema(Id.Planet).uint64('type');
// → Schema<Id.Planets, { type: 0..=18_446_744_073_709_551_615 }>
```

**Note**: values larger than `Number.MAX_SAFE_INTEGER` will be truncated.

### `bigInt32`

Alternative to [`int32`](#int32) that uses `BigInt`. It can store values from 2,147,483,648 to 2,147,483,647, inclusive.

```ts
// A schema with a single field `type` that is a 32-bit integer:

const schema = new Schema(Id.Planet).bigInt32('type');
// → Schema<Id.Planets, { type: 2_147_483_648n..=2_147_483_647n }>
```

### `bigUint32`

Alternative to [`uint32`](#uint32) that uses `BigInt`. It can store values from 0 to 4,294,967,295, inclusive.

```ts
// A schema with a single field `type` that is a 32-bit integer:

const schema = new Schema(Id.Planet).bigUint32('type');
// → Schema<Id.Planets, { type: 0n..=4294967295n }>
```

### `bigInt64`

Alternative to [`int64`](#int64) that uses `BigInt`. It can store values from -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807, inclusive.

```ts
// A schema with a single field `type` that is a 64-bit integer:

const schema = new Schema(Id.Planet).bigInt64('type');
// → Schema<Id.Planets, { type: -9_223_372_036_854_775_808n..=9_223_372_036_854_775_807n }>
```

### `bigUint64`

Alternative to [`uint64`](#uint64) that uses `BigInt`. It can store values from 0 to 18,446,744,073,709,551,615, inclusive.

```ts
// A schema with a single field `type` that is a 64-bit integer:

const schema = new Schema(Id.Planet).bigUint64('type');
// → Schema<Id.Planets, { type: 0n..=18_446_744_073_709_551_615n }>
```

### `float32`

Adds a 32-bit floating-point number to the schema.

```ts
// A schema with a single field `radius` that is a 32-bit floating-point number:

const schema = new Schema(Id.Planet).float32('radius');
// → Schema<Id.Planets, { radius: number }>
```

### `float64`

Adds a 64-bit floating-point number to the schema.

```ts
// A schema with a single field `radius` that is a 64-bit floating-point number:

const schema = new Schema(Id.Planet).float64('radius');
// → Schema<Id.Planets, { radius: number }>
```

### `snowflake`

Adds a 64-bit snowflake to the schema.

```ts
const schema = new Schema(Id.User).snowflake('id');
// → Schema<Id.User, { id: bigint }>
```

### `constant`

A constant value that will not get serialized into the buffer, useful for adding
extra information to the resulting payloads, such as the name of a piece to run.

```ts
// A schema with a single field `handlerName` that is a specific constant:

const schema = new Schema(Id.Planets).constant('handlerFileName', 'planets.ts');
// → Schema<Id.Planets, { handlerFileName: 'planets.ts' }>
```
