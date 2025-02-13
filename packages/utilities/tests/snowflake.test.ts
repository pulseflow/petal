import type { DeconstructedSnowflake } from '../src/lib/snowflake';
import { Snowflake } from '../src/lib/snowflake';

const sampleEpoch = 1577836800000n;

describe('snowflake', () => {
	beforeAll(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2020-01-01T00:00:00.000+00:00'));
	});

	afterAll(() => {
		vi.useRealTimers();
	});

	describe('processId', () => {
		it('given default then returns 1n', () => {
			const snowflake = new Snowflake(sampleEpoch);
			expect(snowflake.processId).toBe(1n);
		});

		it.each([15, 15n])('given valid value (%s) then returns same value as bigint', (value) => {
			const snowflake = new Snowflake(sampleEpoch);
			snowflake.processId = value;
			expect(snowflake.processId).toBe(15n);
		});

		it.each([4200, 4200n])('given out-of-range value (%s) then returns masked value as bigint', (value) => {
			const snowflake = new Snowflake(sampleEpoch);
			snowflake.processId = value;
			expect(snowflake.processId).toBe(8n);
		});
	});

	describe('workerId', () => {
		it('given default then returns 0n', () => {
			const snowflake = new Snowflake(sampleEpoch);
			expect(snowflake.workerId).toBe(0n);
		});

		it.each([15, 15n])('given valid value (%s) then returns same value as bigint', (value) => {
			const snowflake = new Snowflake(sampleEpoch);
			snowflake.workerId = value;
			expect(snowflake.workerId).toBe(15n);
		});

		it.each([4200, 4200n])('given out-of-range value (%s) then returns masked value as bigint', (value) => {
			const snowflake = new Snowflake(sampleEpoch);
			snowflake.workerId = value;
			expect(snowflake.workerId).toBe(8n);
		});
	});

	describe('epoch', () => {
		it.each([sampleEpoch, Number(sampleEpoch), new Date(Number(sampleEpoch))])('given %s then returns 1577836800000n', (value) => {
			const snowflake = new Snowflake(value);
			expect(snowflake.epoch).toBe(sampleEpoch);
		});
	});

	describe('generate', () => {
		it('given timestamp as number then returns predefined snowflake', () => {
			const testId = '3971046231244804096';
			const testTimestamp = 2524608000000;
			const snowflake = new Snowflake(sampleEpoch);
			const snow = snowflake.generate({ timestamp: testTimestamp });

			expect(snow.toString()).toBe(testId);
		});

		it('given timestamp as Date then returns predefined snowflake', () => {
			const testId = '3971046231244804096';
			const testDate = new Date(2524608000000);
			const snowflake = new Snowflake(sampleEpoch);
			const snow = snowflake.generate({ timestamp: testDate });

			expect(snow.toString()).toBe(testId);
		});

		it('given empty object options then returns predefined snowflake', () => {
			const testId = '4096';
			const snowflake = new Snowflake(sampleEpoch);
			const snow = snowflake.generate();

			expect(snow.toString()).toBe(testId);
		});

		it('given no options then returns predefined snowflake', () => {
			const testId = '4096';
			const snowflake = new Snowflake(sampleEpoch);
			const snow = snowflake.generate();

			expect(snow.toString()).toBe(testId);
		});

		it('given timestamp as NaN then returns error', () => {
			const bigIntNaNErrorMessage = (() => {
				try {
					BigInt(Number.NaN);
					throw new RangeError('error');
				}
				catch (error) {
					return (error as RangeError).message;
				}
			})();

			const snowflake = new Snowflake(sampleEpoch);
			expect(() => snowflake.generate({ timestamp: Number.NaN })).toThrowError(bigIntNaNErrorMessage);
		});

		it('given multiple generate calls then generates distinct IDs', () => {
			const snowflake = new Snowflake(sampleEpoch);

			const arrayOf10Snowflakes = [
				snowflake.generate(),
				snowflake.generate(),
				snowflake.generate(),
				snowflake.generate(),
				snowflake.generate(),
				snowflake.generate(),
				snowflake.generate(),
				snowflake.generate(),
				snowflake.generate(),
				snowflake.generate(),
			];

			const setOf10Snowflakes = new Set(arrayOf10Snowflakes);

			// Validate that there are no duplicate IDs
			expect(setOf10Snowflakes.size).toBe(arrayOf10Snowflakes.length);
		});

		it('given timestamp as Date and increment lower than 0n then returns predefined snowflake', () => {
			const testId = '8191';
			const snowflake = new Snowflake(sampleEpoch);
			const snow = snowflake.generate({ increment: -1n });

			expect(snow.toString()).toBe(testId);
		});

		it('given timestamp as Date and increment lower than 4095n then returns predefined snowflake', () => {
			const testId = '6196';
			const snowflake = new Snowflake(sampleEpoch);
			const snow = snowflake.generate({ increment: 2100n });

			expect(snow.toString()).toBe(testId);
		});

		it('given timestamp as Date and increment higher than 4095n then returns predefined snowflake', () => {
			const testId = '5000';
			const snowflake = new Snowflake(sampleEpoch);
			const snow = snowflake.generate({ increment: 5000n });

			expect(snow.toString()).toBe(testId);
		});

		it('given overflowing processId then generates ID with truncated processId', () => {
			const testId = '106496';
			const snowflake = new Snowflake(sampleEpoch);
			const snow = snowflake.generate({ processId: 0b1111_1010n });

			expect(snow.toString()).toBe(testId);
		});

		it('given overflowing default processId then generates ID with truncated processId', () => {
			const testId = '106496';
			const snowflake = new Snowflake(sampleEpoch);
			snowflake.processId = 0b1111_1010n;
			const snow = snowflake.generate();

			expect(snow.toString()).toBe(testId);
		});

		it('given overflowing workerId then generates ID with truncated workerId', () => {
			const testId = '3411968';
			const snowflake = new Snowflake(sampleEpoch);
			const snow = snowflake.generate({ workerId: 0b1111_1010n });

			expect(snow.toString()).toBe(testId);
		});

		it('given overflowing default workerId then generates ID with truncated workerId', () => {
			const testId = '3411968';
			const snowflake = new Snowflake(sampleEpoch);
			snowflake.workerId = 0b1111_1010n;
			const snow = snowflake.generate();

			expect(snow.toString()).toBe(testId);
		});

		describe('increment overrides', () => {
			const IncrementSymbol = Object.getOwnPropertySymbols(new Snowflake(sampleEpoch)).find(
				s => s.description === '@flowr/snowflake.increment',
			);

			if (!IncrementSymbol)
				throw new TypeError('Could not find IncrementSymbol');

			it('given near-limit then it reaches limit', () => {
				const snowflake = new Snowflake(sampleEpoch);
				Reflect.set(snowflake, IncrementSymbol, 4094n);
				const snow = snowflake.generate();

				expect(snow.toString()).toBe('8190');
				expect(Reflect.get(snowflake, IncrementSymbol)).toBe(4095n);
			});

			it('given limit then it cycles to 0', () => {
				const snowflake = new Snowflake(sampleEpoch);
				Reflect.set(snowflake, IncrementSymbol, 4095n);
				const snow = snowflake.generate();

				expect(snow.toString()).toBe('8191');
				expect(Reflect.get(snowflake, IncrementSymbol)).toBe(0n);
			});

			it('given over-limit then it cycles to 0', () => {
				const snowflake = new Snowflake(sampleEpoch);
				Reflect.set(snowflake, IncrementSymbol, 4096n);
				const snow = snowflake.generate();

				expect(snow.toString()).toBe('4096');
				expect(Reflect.get(snowflake, IncrementSymbol)).toBe(1n);
			});

			it('given under-limit then it cycles to 0', () => {
				const snowflake = new Snowflake(sampleEpoch);
				Reflect.set(snowflake, IncrementSymbol, -1n);
				const snow = snowflake.generate();

				expect(snow.toString()).toBe('8191');
				expect(Reflect.get(snowflake, IncrementSymbol)).toBe(0n);
			});
		});
	});

	describe('deconstruct', () => {
		it('given id as string then returns data about snowflake', () => {
			const snowflake = new Snowflake(sampleEpoch);

			const flake = snowflake.deconstruct('3971046231244935169');

			expect(flake).toStrictEqual<DeconstructedSnowflake>({
				epoch: 1577836800000n,
				id: 3971046231244935169n,
				increment: 1n,
				processId: 1n,
				timestamp: 2524608000000n,
				workerId: 1n,
			});
		});

		it('given id as bigint then returns data about snowflake', () => {
			const snowflake = new Snowflake(sampleEpoch);

			const flake = snowflake.deconstruct(3971046231244935168n);

			expect(flake).toStrictEqual<DeconstructedSnowflake>({
				epoch: 1577836800000n,
				id: 3971046231244935168n,
				increment: 0n,
				processId: 1n,
				timestamp: 2524608000000n,
				workerId: 1n,
			});
		});
	});

	describe('decode', () => {
		it('given id as string then returns data about snowflake', () => {
			const snowflake = new Snowflake(sampleEpoch);

			const flake = snowflake.decode('3971046231244935169');

			expect(flake).toStrictEqual<DeconstructedSnowflake>({
				epoch: 1577836800000n,
				id: 3971046231244935169n,
				increment: 1n,
				processId: 1n,
				timestamp: 2524608000000n,
				workerId: 1n,
			});
		});

		it('given id as bigint then returns data about snowflake', () => {
			const snowflake = new Snowflake(sampleEpoch);

			const flake = snowflake.decode(3971046231244935168n);

			expect(flake).toStrictEqual<DeconstructedSnowflake>({
				epoch: 1577836800000n,
				id: 3971046231244935168n,
				increment: 0n,
				processId: 1n,
				timestamp: 2524608000000n,
				workerId: 1n,
			});
		});
	});

	describe('timestampFrom', () => {
		const snowflake = new Snowflake(sampleEpoch);

		it('given id as string then returns data about snowflake', () => {
			const timestamp = snowflake.timestampFrom('3971046231244935169');
			expect(timestamp).toBe(2524608000000);
		});

		it('given id as bigint then returns data about snowflake', () => {
			const timestamp = snowflake.timestampFrom(3971046231244935168n);
			expect(timestamp).toBe(2524608000000);
		});
	});

	describe.each([
		[String, String],
		[String, BigInt],
		[BigInt, String],
		[BigInt, BigInt],
	])('compare', (ctorA, ctorB) => {
		it.each([
			[ctorA(737141877803057244n), ctorB(254360814063058944n), 1],
			[ctorA(1737141877803057244n), ctorB(254360814063058944n), 1],
			[ctorA(737141877803057244n), ctorB(737141877803057244n), 0],
			[ctorA(254360814063058944n), ctorB(737141877803057244n), -1],
			[ctorA(254360814063058944n), ctorB(1737141877803057244n), -1],
		])('given %o and %o then returns %d', (a, b, expected) => {
			expect(Snowflake.compare(a, b)).toBe(expected);
		});
	});
});
