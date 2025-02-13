import type { Base, Variation } from './base.ts';
import nacl from 'tweetnacl';
import b from './base.ts';

export type Bit = 0 | 1;
export type BufferLike = Uint8Array | ArrayBuffer | string;
export const rand: (n: number) => Uint8Array = n => nacl.randomBytes(n);
export const x25519: (n: Uint8Array) => Uint8Array = n => nacl.scalarMult.base(n);
export const sha512: (msg: BufferLike) => Uint8Array = msg => nacl.hash(toUint8Array(msg));
export const sha256: (msg: BufferLike) => Promise<Uint8Array> = async msg => crypto.subtle.digest('SHA-256', toUint8Array(msg)).then(toUint8Array);
export function pair(priv?: Uint8Array): readonly [Uint8Array, Uint8Array] {
	priv = priv ?? rand(32);
	return [priv, x25519(priv)] as const;
}

export function toUint8Array(buf: BufferLike): Uint8Array;
export function toUint8Array<B extends Base>(buf: string, base: B, variation?: Variation<B>): Uint8Array;
export function toUint8Array<B extends Base | undefined>(buf: BufferLike, base?: B, variation?: Variation<NonNullable<B>>): Uint8Array {
	if (typeof buf === 'string') {
		if (base)
			return b(base, variation!).decode(buf);

		return new TextEncoder().encode(buf);
	}

	return new Uint8Array(buf);
}

export function verify(msg: Uint8Array, sig: Uint8Array, publicKey: Uint8Array): boolean {
	try {
		return nacl.sign.detached.verify(msg, sig, publicKey);
	}
	catch (error) {
		console.error(error);
		return false;
	}
}

export function uint8ArrayToBits(array: Uint8Array): Bit[] {
	const result: number[] = Array.from({ length: array.length * 8 });
	for (const [i, byte] of array.entries())
		for (let j = 0; j < 8; j++)
			result[i * 8 + j] = (byte >> j) & 1;

	return result as Bit[];
}

export function bitGenerator(): () => Bit {
	const context = {
		consumed: 0,
		random: uint8ArrayToBits(rand(1)),
	};

	const next = (): Bit => {
		if (context.consumed === 8) {
			context.random = uint8ArrayToBits(rand(1));
			context.consumed = 0;
		}

		return context.random[context.consumed++];
	};

	return next;
}

export const bit = bitGenerator();

export function po2(num: bigint): bigint {
	num |= num >> 1n;
	num |= num >> 2n;
	num |= num >> 4n;
	num |= num >> 8n;
	num |= num >> 16n;
	num |= num >> 32n;
	num |= num >> 64n;
	return num + 1n;
}
