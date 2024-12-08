import type { IType } from './base/IType.ts';

export const Int2Type: IType<number, 2> = {
	serialize(buffer, value) {
		buffer.writeInt2(value);
	},
	deserialize(buffer, pointer) {
		return buffer.readInt2(pointer);
	},
	BIT_SIZE: 2,
};
