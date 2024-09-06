import { decodeAscii85, encodeAscii85 } from '@std/encoding/ascii85';
import { decodeBase32, encodeBase32 } from '@std/encoding/base32';
import { decodeBase58, encodeBase58 } from '@std/encoding/base58';
import { decodeBase64, encodeBase64 } from '@std/encoding/base64';
import { decodeBase64Url, encodeBase64Url } from '@std/encoding/base64url';
import { decodeHex, encodeHex } from '@std/encoding/hex';
import nacl from 'tweetnacl';

export type BufferLike = Uint8Array | ArrayBuffer | string;

type Bit = 0 | 1;
type Encodable = ArrayBuffer | Uint8Array | string;
type Encoder = (data: Encodable) => string;
type Decoder = (src: string) => Uint8Array;
type StringDecoder = (src: string) => string;
const te = new TextDecoder();

type Ascii85Standard = 'Adobe' | 'btoa' | 'RFC 1924' | 'Z85';
type Base64Standard = 'btoa' | 'url' | 'url_padded';

const encodeBase64UrlPadded = (data: Encodable): string => encodeBase64(data).replace(/\+/g, '-').replace(/\//g, '_');
const decodeBase64UrlPadded = (src: string): Uint8Array => decodeBase64(src.replace(/-/g, '+').replace(/_/g, '/'));

const enc = {
	16: encodeHex,
	32: encodeBase32,
	58: encodeBase58,
	64: (data: Encodable, standard: Base64Standard = 'btoa') =>
		({
			btoa: encodeBase64,
			url: encodeBase64Url,
			url_padded: encodeBase64UrlPadded,
		})[standard](data),
	85: (data: Encodable, standard?: Ascii85Standard) =>
		encodeAscii85(data, { standard }),
};

const dec = {
	16: decodeHex,
	32: decodeBase32,
	58: decodeBase58,
	64: (src: string, standard: Base64Standard = 'btoa') =>
		({
			btoa: decodeBase64,
			url: decodeBase64Url,
			url_padded: decodeBase64UrlPadded,
		})[standard](src),
	85: (src: string, standard?: Ascii85Standard) =>
		decodeAscii85(src, { standard }),
};

export type Base = Extract<keyof typeof enc, number>;
export type Variation<T extends Base> = NonNullable<Parameters<(typeof enc)[T]>[1]>;

interface BaseProvider { e: Encoder; d: Decoder; s: StringDecoder }

export default function base(b: Base): BaseProvider;
export default function base<T extends Base>(b: T, v: Variation<T>): BaseProvider;
export default function base<T extends Base>(b: T, v?: Variation<T>): BaseProvider {
	const e = enc[b] as (x: Encodable, v?: string) => string;
	const d = dec[b] as (x: string, v?: string) => Uint8Array;

	return {
		e: x => e(x, v),
		d: x => d(x, v),
		s: x => te.decode(d(x, v)),
	};
}

export const rand: (n: number) => Uint8Array = nacl.randomBytes;
export const x25519: (n: Uint8Array) => Uint8Array = nacl.scalarMult.base;
export const sha512 = (msg: BufferLike): Uint8Array => nacl.hash(toUint8s(msg));
export const sha256 = async (msg: BufferLike): Promise<Uint8Array> => toUint8s(await crypto.subtle.digest('SHA-256', toUint8s(msg)));
export function pair(pk?: Uint8Array): readonly [Uint8Array, Uint8Array] {
	const priv = pk ?? rand(32);
	const pub = x25519(priv);
	return [priv, pub] as const;
}

export function toUint8s(x: BufferLike): Uint8Array;
export function toUint8s<T extends Base>(x: string, b: T, v?: Variation<T>): Uint8Array;
export function toUint8s<T extends Base | undefined>(x: BufferLike, b?: T, v?: Variation<NonNullable<T>>): Uint8Array {
	if (typeof x === 'string') {
		if (b)
			return base(b, v!).d(x);
		return new TextEncoder().encode(x);
	}

	return new Uint8Array(x);
}

export function verify(msg: Uint8Array, sig: Uint8Array, publicKey: Uint8Array): boolean {
	try {
		return nacl.sign.detached.verify(msg, sig, publicKey);
	}
	catch (err) {
		console.error(err);
		return false;
	}
}

function uint8sToBits(arr: Uint8Array): Bit[] {
	const result: number[] = Array.from({ length: arr.length * 8 });
	for (const [i, b] of arr.entries())
		for (let j = 0; j < 8; j++)
			result[i * 8 + j] = (b >> j) & 1;

	return result as Bit[];
}

function bitGenerator(): () => Bit {
	const state = {
		consumed: 0,
		random: uint8sToBits(rand(1)),
	};

	const next = (): Bit => {
		if (state.consumed === 8) {
			state.random = uint8sToBits(rand(1));
			state.consumed = 0;
		}

		return state.random[state.consumed++];
	};

	return next;
}

export const bit: () => Bit = bitGenerator();

export function po2(x: bigint): bigint {
	x |= x >> 1n;
	x |= x >> 2n;
	x |= x >> 4n;
	x |= x >> 8n;
	x |= x >> 16n;
	x |= x >> 32n;
	x |= x >> 64n;
	return x + 1n;
}

const diceState = {
	mod: 1n,
	rnd: 0n,
	batchSize: 1n << 8n,
};

export function dice<T extends number | bigint>(maxExclusive: T, minInclusive?: T): T {
	const isInt = typeof maxExclusive === 'number';
	const max = BigInt(maxExclusive);
	const min = BigInt(minInclusive ?? 0n);
	const n = BigInt(max - min);
	if (n > diceState.batchSize)
		diceState.batchSize = po2(n);

	const res = min + _dice(n);
	if (isInt)
		return Number(res) as T;

	return res as T;
}

function _dice(n: bigint): bigint {
	while (diceState.mod < diceState.batchSize) {
		diceState.rnd <<= 1n;
		diceState.rnd += BigInt(bit());
		diceState.mod <<= 1n;
	}

	const q = diceState.mod / n;
	const qn = q * n;

	if (diceState.rnd >= qn) {
		diceState.mod -= qn;
		diceState.rnd -= qn;
		return _dice(n);
	}

	const result = diceState.rnd % n;
	diceState.rnd /= n;
	diceState.mod = q;

	return result;
}
