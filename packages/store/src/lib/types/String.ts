import type { IType } from './base/IType.ts';

// eslint-disable-next-line node/prefer-global/text-encoder -- iife
const encoder = new TextEncoder();
// eslint-disable-next-line node/prefer-global/text-decoder -- iife
const decoder = new TextDecoder();
export const StringType: IType<string, null> = {
	serialize(buffer, value) {
		const encoded = encoder.encode(value);
		buffer.writeInt16(encoded.length);
		for (const byte of encoded)
			buffer.writeInt8(byte);
	},
	deserialize(buffer, pointer) {
		const length = buffer.readInt16(pointer);
		const bytes = new Uint8Array(length);
		for (let i = 0; i < length; i++)
			bytes[i] = buffer.readInt8(pointer);

		return decoder.decode(bytes);
	},
	BIT_SIZE: null,
};