import type { IType } from './base/IType.ts';

export const BigInt32Type: IType<bigint, 32> = {
	serialize(buffer, value) {
		buffer.writeBigInt32(value);
	},
	deserialize(buffer, pointer) {
		return buffer.readBigInt32(pointer);
	},
	BIT_SIZE: 32,
};
