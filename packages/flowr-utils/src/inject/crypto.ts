import nacl from 'tweetnacl';

export const rand = nacl.randomBytes;
export const x25519 = nacl.scalarMult.base;
export const hash = nacl.hash;

export function pair() {
	const priv = rand(32);
	const pub = x25519(priv);

	return [priv, pub] as const;
}

type Bit = 0 | 1;

function uint8_to_bits(arr: Uint8Array): Bit[] {
	const result: Bit[] = Array.from({ length: arr.length * 8 });
	for (const [i, byte] of arr.entries()) {
		for (let j = 0; j < 8; j++)
			result[i * 8 + j] = ((byte >> j) & 1) as Bit;
	}

	return result;
}

function bit_generator() {
	let consumed = 0;
	let random = uint8_to_bits(rand(1));

	function next() {
		if (consumed === 8) {
			random = uint8_to_bits(rand(1));
			consumed = 0;
		}

		return random[consumed++];
	}

	return next;
}

export const bit = bit_generator();

export function po2(x: bigint) {
	x |= (x >> 1n);
	x |= (x >> 2n);
	x |= (x >> 4n);
	x |= (x >> 8n);
	x |= (x >> 16n);
	x |= (x >> 32n);
	x |= (x >> 64n);
	return x + 1n;
}

let mod = 1n;
let rnd = 0n;
let batch_size = 1n << 8n;

export function dice<T extends number | bigint>(max_exclusive: T, min_inclusive?: T): T {
	const is_int = typeof max_exclusive === 'number';
	const max = BigInt(max_exclusive);
	const min = BigInt(min_inclusive ?? 0n);
	const n = BigInt(max - min);

	if (n > batch_size)
		batch_size = po2(n);

	const res = min + _dice(n);

	if (is_int)
		return Number(res) as T;

	return res as T;
}

function _dice(n: bigint): bigint {
	while (mod < batch_size) {
		rnd <<= 1n;
		rnd += BigInt(bit());
		mod <<= 1n;
	}

	const q = mod / n;
	const qn = q * n;

	if (rnd >= qn) {
		mod -= qn;
		rnd -= qn;
		return _dice(n);
	}

	const result = rnd % n;
	rnd /= n;
	mod = q;

	return result;
}
