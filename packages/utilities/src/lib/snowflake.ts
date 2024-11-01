const IncrementSymbol: unique symbol = Symbol('@flowr/snowflake.increment');
const EpochSymbol: unique symbol = Symbol('@flowr/snowflake.epoch');
const EpochNumberSymbol: unique symbol = Symbol('@flowr/snowflake.epoch.number');
const ProcessIdSymbol: unique symbol = Symbol('@flowr/snowflake.processId');
const WorkerIdSymbol: unique symbol = Symbol('@flowr/snowflake.workerId');

/**
 * The maximum value the `workerId` field accepts in snowflakes.
 */
export const MaximumWorkerId = 0b11111n;

/**
 * The maximum value the `processId` field accepts in snowflakes.
 */
export const MaximumProcessId = 0b11111n;

/**
 * The maximum value the `increment` field accepts in snowflakes.
 */
export const MaximumIncrement = 0b111111111111n;

const TimestampFieldDivisor = 2 ** 22;

/**
 * A class for generating and deconstructing Twitter snowflakes.
 *
 * A {@linkplain https://developer.twitter.com/en/docs/twitter-ids Twitter snowflake}
 * is a 64-bit unsigned integer with 4 fields that have a fixed epoch value.
 *
 * If we have a snowflake we can represent it as binary:
 * ```
 * 64                                          22     17     12          0
 *  000000111011000111100001101001000101000000  00001  00000  000000000000
 *           number of ms since epoch           worker  pid    increment
 * ```
 */
export class Snowflake {
	/**
	 * Alias for {@link deconstruct}
	 */
	public decode = (id: string | bigint): DeconstructedSnowflake => this.deconstruct(id);

	/**
	 * Internal reference of the epoch passed in the constructor
	 * @internal
	 */
	private readonly [EpochSymbol]: bigint;

	/**
	 * Internal reference of the epoch passed in the constructor as a number
	 * @internal
	 */
	private readonly [EpochNumberSymbol]: number;

	/**
	 * Internal incrementor for generating snowflakes
	 * @internal
	 */
	private [IncrementSymbol] = 0n;

	/**
	 * The process ID that will be used by default in the generate method
	 * @internal
	 */
	private [ProcessIdSymbol] = 1n;

	/**
	 * The worker ID that will be used by default in the generate method
	 * @internal
	 */
	private [WorkerIdSymbol] = 0n;

	/**
	 * @param epoch the epoch to use
	 */
	public constructor(epoch: number | bigint | Date) {
		this[EpochSymbol] = BigInt(epoch instanceof Date ? epoch.getTime() : epoch);
		this[EpochNumberSymbol] = Number(this[EpochSymbol]);
	}

	/**
	 * The epoch for this snowflake, as a bigint
	 */
	public get epoch(): bigint {
		return this[EpochSymbol];
	}

	/**
	 * The epoch for this snowflake, as a number
	 */
	public get epochNumber(): number {
		return this[EpochNumberSymbol];
	}

	/**
	 * Gets the configured process ID
	 */
	public get processId(): bigint {
		return this[ProcessIdSymbol];
	}

	/**
	 * Sets the process ID that will be used by default for the {@link generate} method
	 * @param value The new value, will be coerced to BigInt and masked with `0b11111n`
	 */
	public set processId(value: number | bigint) {
		this[ProcessIdSymbol] = BigInt(value) & MaximumProcessId;
	}

	/**
	 * Gets the configured worker ID
	 */
	public get workerId(): bigint {
		return this[WorkerIdSymbol];
	}

	/**
	 * Sets the worker ID that will be used by default for the {@link generate} method
	 * @param value The new value, will be coerced to BigInt and masked with `0b11111n`
	 */
	public set workerId(value: number | bigint) {
		this[WorkerIdSymbol] = BigInt(value) & MaximumWorkerId;
	}

	/**
	 * Generates a snowflake given an epoch and optionally a timestamp
	 *
	 * **note** when `increment` is not provided it defaults to the private `increment` of the instance
	 * @example
	 * ```typescript
	 * const epoch = new Date('2000-01-01T00:00:00.000Z');
	 * const snowflake = new Snowflake(epoch).generate();
	 * ```
	 * @returns A unique snowflake
	 */
	public generate({
		increment,
		processId = this[ProcessIdSymbol],
		timestamp = Date.now(),
		workerId = this[WorkerIdSymbol],
	}: SnowflakeGenerateOptions = {}): bigint {
		if (timestamp instanceof Date)
			timestamp = BigInt(timestamp.getTime());
		else if (typeof timestamp === 'number')
			timestamp = BigInt(timestamp);
		else if (typeof timestamp !== 'bigint')
			throw new TypeError(`"timestamp" argument must be a number, bigint, or Date (received ${typeof timestamp})`);

		if (typeof increment !== 'bigint') {
			increment = this[IncrementSymbol];
			this[IncrementSymbol] = (increment + 1n) & MaximumIncrement;
		}

		// timestamp, workerId, processId, increment
		return (
			((timestamp - this[EpochSymbol]) << 22n)
			| ((workerId & MaximumWorkerId) << 17n)
			| ((processId & MaximumProcessId) << 12n)
			| (increment & MaximumIncrement)
		);
	}

	/**
	 * Deconstructs a snowflake given a snowflake ID
	 * @param id the snowflake to deconstruct
	 * @returns a deconstructed snowflake
	 */
	public deconstruct(id: string | bigint): DeconstructedSnowflake {
		const bigIntId = BigInt(id);
		const epoch = this[EpochSymbol];
		return {
			epoch,
			id: bigIntId,
			increment: bigIntId & MaximumIncrement,
			processId: (bigIntId >> 12n) & MaximumProcessId,
			timestamp: (bigIntId >> 22n) + epoch,
			workerId: (bigIntId >> 17n) & MaximumWorkerId,
		};
	}

	/**
	 * Retrieves the timestamp field's value from a snowflake.
	 * @param id The snowflake to get the timestamp value from.
	 * @returns The UNIX timestamp that is stored in `id`.
	 */
	public timestampFrom(id: string | bigint): number {
		return Math.floor(Number(id) / TimestampFieldDivisor) + this[EpochNumberSymbol];
	}

	/**
	 * Returns a number indicating whether a reference snowflake comes before, or after, or is same as the given
	 * snowflake in sort order.
	 * @param a The first snowflake to compare.
	 * @param b The second snowflake to compare.
	 * @returns `-1` if `a` is older than `b`, `0` if `a` and `b` are equals, `1` if `a` is newer than `b`.
	 */
	public static compare(a: string | bigint, b: string | bigint): -1 | 0 | 1 {
		return typeof a === typeof b
			? typeof a === 'string'
				? cmpString(a, b as string)
				: cmpBigInt(a, b as bigint)
			: cmpBigInt(BigInt(a), BigInt(b));
	}
}

/**
 * A class for parsing snowflake ids using Twitter's snowflake epoch
 *
 * Which is 2010-11-04 at 01:42:54.657 UTC+0, found in the archived snowflake repository {@linkplain https://github.com/twitter-archive/snowflake/blob/b3f6a3c6ca8e1b6847baa6ff42bf72201e2c2231/src/main/scala/com/twitter/service/snowflake/IdWorker.scala#L25}
 */
export const TwitterSnowflake = new Snowflake(1288834974657n);

/**
 * A class for parsing snowflake ids using Discord's snowflake epoch
 *
 * Which is 2015-01-01 at 00:00:00.000 UTC+0, according to {@linkplain https://discord.com/developers/docs/reference#snowflakes}
 */
export const DiscordSnowflake = new Snowflake(1420070400000n);

/** @internal */
function cmpBigInt(a: bigint, b: bigint): 1 | -1 | 0 {
	return a === b ? 0 : a < b ? -1 : 1;
}

/** @internal */
function cmpString(a: string, b: string): 1 | -1 | 0 {
	return a === b ? 0 : a.length < b.length ? -1 : a.length > b.length ? 1 : a < b ? -1 : 1;
}

/**
 * Options for Snowflake#generate
 */
export interface SnowflakeGenerateOptions {
	/**
	 * Timestamp or date of the snowflake to generate
	 * @default Date.now()
	 */
	timestamp?: number | bigint | Date;

	/**
	 * The increment to use
	 * @default 0n
	 * @remark keep in mind that this bigint is auto-incremented between generate calls
	 */
	increment?: bigint;

	/**
	 * The worker ID to use, will be truncated to 5 bits (0-31)
	 * @default 0n
	 */
	workerId?: bigint;

	/**
	 * The process ID to use, will be truncated to 5 bits (0-31)
	 * @default 1n
	 */
	processId?: bigint;
}

/**
 * Object returned by {@link Snowflake#deconstruct}
 */
export interface DeconstructedSnowflake {
	/**
	 * The id in BigInt form
	 */
	id: bigint;

	/**
	 * The timestamp stored in the snowflake
	 */
	timestamp: bigint;

	/**
	 * The worker id stored in the snowflake
	 */
	workerId: bigint;

	/**
	 * The process id stored in the snowflake
	 */
	processId: bigint;

	/**
	 * The increment stored in the snowflake
	 */
	increment: bigint;

	/**
	 * The epoch to use in the snowflake
	 */
	epoch: bigint;
}
