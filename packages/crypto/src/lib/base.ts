import type { Ascii85Standard } from '@std/encoding/ascii85';
import { decodeAscii85, encodeAscii85 } from '@std/encoding/ascii85';
import { decodeBase32, encodeBase32 } from '@std/encoding/base32';
import { decodeBase58, encodeBase58 } from '@std/encoding/base58';
import { decodeBase64, encodeBase64 } from '@std/encoding/base64';
import { decodeBase64Url, encodeBase64Url } from '@std/encoding/base64url';
import { decodeHex, encodeHex } from '@std/encoding/hex';
// import { decodeVarint, encodeVarint } from '@std/encoding/varint';

export type Encodable = ArrayBuffer | Uint8Array | string;
export type Encoder = (data: Encodable) => string;
export type Decoder = (source: string) => Uint8Array;
export type StringDecoder = (source: string) => string;
export type Base64Standard = 'btoa' | 'url' | 'url_padded';

const textDecoder = new TextDecoder();
const $pad_encodeBase64Url: Encoder = data => encodeBase64(data).replace(/\+/g, '-').replace(/\//g, '_');
const $pad_decodeBase64Url: Decoder = source => decodeBase64(source.replace(/-/g, '+').replace(/_/g, '/'));
const $petal_encodeBase64 = (data: Encodable, standard: Base64Standard = 'btoa'): string => ({ btoa: encodeBase64, url: encodeBase64Url, url_padded: $pad_encodeBase64Url })[standard](data);
const $petal_encodeAscii85 = (data: Encodable, standard?: Ascii85Standard): string => encodeAscii85(data, { standard });
const $petal_decodeBase64 = (source: string, standard: Base64Standard = 'btoa'): Uint8Array => ({ btoa: decodeBase64, url: decodeBase64Url, url_padded: $pad_decodeBase64Url })[standard](source);
const $petal_decodeAscii85 = (source: string, standard?: Ascii85Standard): Uint8Array => decodeAscii85(source, { standard });

const encoders = {
	16: encodeHex,
	32: encodeBase32,
	58: encodeBase58,
	64: $petal_encodeBase64,
	85: $petal_encodeAscii85,
};

const decoders = {
	16: decodeHex,
	32: decodeBase32,
	58: decodeBase58,
	64: $petal_decodeBase64,
	85: $petal_decodeAscii85,
};

export type Base = Extract<keyof typeof encoders, number>;
export type Variation<B extends Base> = NonNullable<Parameters<(typeof encoders)[B]>[1]>;
export interface BaseProvider { encode: Encoder; decode: Decoder; decodeString: StringDecoder }

export function base(base: Base): BaseProvider;
export function base<B extends Base>(base: B, variation: Variation<B>): BaseProvider;
export function base<B extends Base>(base: B, variation?: Variation<B>): BaseProvider {
	const encoder = encoders[base] as (data: Encodable, variation?: string) => string;
	const decoder = decoders[base] as (source: string, variation?: string) => Uint8Array;

	return {
		encode: data => encoder(data, variation),
		decode: source => decoder(source, variation),
		decodeString: source => textDecoder.decode(decoder(source, variation)),
	};
}

export { base as b };
export default base;
