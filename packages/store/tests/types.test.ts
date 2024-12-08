import { Pointer, SnowflakeType, StringType, t, UnalignedUint16Array } from '../src';

describe('types', () => {
	describe('boolean', () => {
		const type = t.boolean;

		it('given type then it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(1);
		});

		it('given a buffer then it serializes and deserializes correctly', () => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, true);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual(true);
		});
	});

	describe('bit', () => {
		const type = t.bit;

		it('given type then it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(1);
		});

		it('given a buffer then it serializes and deserializes correctly', () => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, 1);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual(1);
		});
	});

	describe('int2', () => {
		const type = t.int2;

		it('given type then it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(2);
		});

		it.each([-2, -1, 0, -1])('given a buffer then it serializes and deserializes correctly', (value) => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, value);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual(value);
		});
	});

	describe('uint2', () => {
		const type = t.uint2;

		it('given type then it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(2);
		});

		it.each([0, 1, 2, 3])('given a buffer then it serializes and deserializes correctly', (value) => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, value);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual(value);
		});
	});

	describe('int4', () => {
		const type = t.int4;

		it('given type then it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(4);
		});

		it.each([-8, -6, 0, 7])('given a buffer then it serializes and deserializes correctly', (value) => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, value);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual(value);
		});
	});

	describe('uint4', () => {
		const type = t.uint4;

		it('given type then it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(4);
		});

		it.each([0, 1, 14, 15])('given a buffer then it serializes and deserializes correctly', (value) => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, value);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual(value);
		});
	});

	describe('int8', () => {
		const type = t.int8;

		it('given type then it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(8);
		});

		it.each([-128, -100, 0, 127])('given a buffer then it serializes and deserializes correctly', (value) => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, value);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual(value);
		});
	});

	describe('uint8', () => {
		const type = t.uint8;

		it('given type then it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(8);
		});

		it.each([0, 100, 200, 255])('given a buffer then it serializes and deserializes correctly', (value) => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, value);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual(value);
		});
	});

	describe('int16', () => {
		const type = t.int16;

		it('given type then it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(16);
		});

		it.each([-32768, -100, 10, 32767])('given a buffer then it serializes and deserializes correctly', (value) => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, value);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual(value);
		});
	});

	describe('uint16', () => {
		const type = t.uint16;

		it('given type then it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(16);
		});

		it.each([0, 2500, 30000, 65535])('given a buffer then it serializes and deserializes correctly', (value) => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, value);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual(value);
		});
	});

	describe('int32', () => {
		const type = t.int32;

		it('given type then it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(32);
		});

		it.each([-2_147_483_648, -52100, 420, 2_147_483_647])('given a buffer then it serializes and deserializes correctly', (value) => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, value);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual(value);
		});
	});

	describe('uint32', () => {
		const type = t.uint32;

		it('given type then it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(32);
		});

		it.each([0, 420, 4_294_967_295])('given a buffer then it serializes and deserializes correctly', (value) => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, value);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual(value);
		});
	});

	describe('int64', () => {
		const type = t.int64;

		it('given type then it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(64);
		});

		it.each([-9_007_199_254_740_991, 420_000, 9_007_199_254_740_991])(
			'given a buffer then it serializes and deserializes correctly',
			(value) => {
				const buffer = new UnalignedUint16Array(10);

				type.serialize(buffer, value);

				const deserialized = type.deserialize(buffer, new Pointer());
				expect(deserialized).toEqual(value);
			},
		);
	});

	describe('uint64', () => {
		const type = t.uint64;

		it('given type then it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(64);
		});

		it.each([0, 640_000_420, 9_007_199_254_740_991])('given a buffer then it serializes and deserializes correctly', (value) => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, value);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual(value);
		});
	});

	describe('bigInt32', () => {
		const type = t.bigInt32;

		it('given type then it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(32);
		});

		it.each([-2_147_483_648n, -52100n, 420n, 2_147_483_647n])('given a buffer then it serializes and deserializes correctly', (value) => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, value);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual(value);
		});
	});

	describe('bigUint32', () => {
		const type = t.bigUint32;

		it('given type then it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(32);
		});

		it.each([0n, 420n, 4_294_967_295n])('given a buffer then it serializes and deserializes correctly', (value) => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, value);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual(value);
		});
	});

	describe('bigInt64', () => {
		const type = t.bigInt64;

		it('given type then it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(64);
		});

		it.each([-9_223_372_036_854_775_808n, -420n, 420n, 9_223_372_036_854_775_807n])(
			'given a buffer then it serializes and deserializes correctly',
			(value) => {
				const buffer = new UnalignedUint16Array(10);

				type.serialize(buffer, value);

				const deserialized = type.deserialize(buffer, new Pointer());
				expect(deserialized).toEqual(value);
			},
		);
	});

	describe('bigUint64', () => {
		const type = t.bigUint64;

		it('given type then it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(64);
		});

		it.each([0n, 18_446_744_073_709_551_615n])('given a buffer then it serializes and deserializes correctly', (value) => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, value);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual(value);
		});
	});

	describe('float32', () => {
		const type = t.float32;

		it('given type then it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(32);
		});

		it('given a buffer then it serializes and deserializes correctly', () => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, 1.1);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toBeCloseTo(1.1);
		});
	});

	describe('float64', () => {
		const type = t.float64;

		it('given type then it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(64);
		});

		it('given a buffer then it serializes and deserializes correctly', () => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, 1.1);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toBeCloseTo(1.1);
		});
	});

	describe('array(Bit)', () => {
		const type = t.array(t.bit);

		it('given type then it has the correct properties', () => {
			expect(type.BIT_SIZE).toBeNull();
		});

		it('given a buffer then it serializes and deserializes correctly', () => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, [1, 0, 1, 0, 1]);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual([1, 0, 1, 0, 1]);
		});

		it.each(['Foo', () => {}, true, 42, 100n, Symbol('foo'), {}, { length: '0' }, { length: 1 }])(
			'given an invalid value then it throws an error',
			(value) => {
				const buffer = new UnalignedUint16Array(10);
				// @ts-expect-error: Testing invalid input
				expect(() => type.serialize(buffer, value)).toThrowError();
			},
		);
	});

	describe('fixedLengthArray(Bit)', () => {
		const type = t.fixedLengthArray(t.bit, 2);

		it('given type then it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(2);
		});

		it('given a buffer then it serializes and deserializes correctly', () => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, [1, 0]);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual([1, 0]);
		});

		it.each(['Foo', () => {}, true, 42, 100n, Symbol('foo'), {}, { length: '0' }, { length: 1 }, { length: 1.5 }, [], [1, 2, 3]])(
			'given an invalid value then it throws an error',
			(value) => {
				const buffer = new UnalignedUint16Array(10);
				// @ts-expect-error: Testing invalid input
				expect(() => type.serialize(buffer, value)).toThrowError();
			},
		);
	});

	describe('string', () => {
		const type = StringType;

		it('given type then it has the correct properties', () => {
			expect(type.BIT_SIZE).toBeNull();
		});

		it('given a buffer then it serializes and deserializes correctly', () => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, 'Hello, World!');

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual('Hello, World!');
		});
	});

	describe('snowflake', () => {
		const type = SnowflakeType;

		it('given type then it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(64);
		});

		it.each([737141877803057244n, '737141877803057244'])('given a buffer then it serializes and deserializes correctly', (value) => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, value);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual(737141877803057244n);
		});
	});
});
