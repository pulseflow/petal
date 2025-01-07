import type { IType } from './base/IType.ts';
import { ArrayType } from './Array.ts';
import { BigInt32Type } from './BigInt32.ts';
import { BigInt64Type } from './BigInt64.ts';
import { BigUint32Type } from './BigUint32.ts';
import { BigUint64Type } from './BigUint64.ts';
import { BitType } from './Bit.ts';
import { BooleanType } from './Boolean.ts';
import { ConstantType } from './Constant.ts';
import { FixedLengthArrayType } from './FixedLengthArray.ts';
import { Float32Type } from './Float32.ts';
import { Float64Type } from './Float64.ts';
import { Int2Type } from './Int2.ts';
import { Int4Type } from './Int4.ts';
import { Int8Type } from './Int8.ts';
import { Int16Type } from './Int16.ts';
import { Int32Type } from './Int32.ts';
import { Int64Type } from './Int64.ts';
import { NullableType } from './Nullable.ts';
import { SnowflakeType } from './Snowflake.ts';
import { StringType } from './String.ts';
import { Uint2Type } from './Uint2.ts';
import { Uint4Type } from './Uint4.ts';
import { Uint8Type } from './Uint8.ts';
import { Uint16Type } from './Uint16.ts';
import { Uint32Type } from './Uint32.ts';
import { Uint64Type } from './Uint64.ts';

// @keep-sorted
export const t = {
	array: ArrayType,
	bigInt32: BigInt32Type,
	bigInt64: BigInt64Type,
	bigUint32: BigUint32Type,
	bigUint64: BigUint64Type,
	bit: BitType,
	boolean: BooleanType,
	constant: ConstantType,
	fixedLengthArray: FixedLengthArrayType,
	float32: Float32Type,
	float64: Float64Type,
	int16: Int16Type,
	int2: Int2Type,
	int32: Int32Type,
	int4: Int4Type,
	int64: Int64Type,
	int8: Int8Type,
	nullable: NullableType,
	snowflake: SnowflakeType,
	string: StringType,
	uint16: Uint16Type,
	uint2: Uint2Type,
	uint32: Uint32Type,
	uint4: Uint4Type,
	uint64: Uint64Type,
	uint8: Uint8Type,
};

export {
	ArrayType,
	BigInt32Type,
	BigInt64Type,
	BigUint32Type,
	BigUint64Type,
	BitType,
	BooleanType,
	ConstantType,
	FixedLengthArrayType,
	Float32Type,
	Float64Type,
	Int2Type,
	Int4Type,
	Int8Type,
	Int16Type,
	Int32Type,
	Int64Type,
	type IType,
	NullableType,
	SnowflakeType,
	StringType,
	Uint2Type,
	Uint4Type,
	Uint8Type,
	Uint16Type,
	Uint32Type,
	Uint64Type,
};
