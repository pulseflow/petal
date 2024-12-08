import type { IType } from './base/IType.ts';

export const SnowflakeType = {
	serialize(buffer, value: bigint | string) {
		buffer.writeBigInt64(BigInt(value));
	},
	deserialize(buffer, offset) {
		return buffer.readBigUint64(offset);
	},
	BIT_SIZE: 64,
} as const satisfies IType<bigint, 64>;
