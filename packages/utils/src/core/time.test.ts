import { Duration } from 'luxon';
import { describe, expect, it } from 'vitest';
import type { HumanDuration } from './time';
import { durationToMilliseconds } from './time';

describe('time', () => {
	describe('humanDuration', () => {
		const durations: HumanDuration[] = [
			{ years: 1 },
			{ months: 1 },
			{ weeks: 1 },
			{ days: 1 },
			{ hours: 1 },
			{ minutes: 1 },
			{ seconds: 1 },
			{ milliseconds: 1 },
		];
		it.each(durations)('successfully parsed by luxon, %p', (d) => {
			expect(Duration.fromObject(d).toObject()).toEqual(d);
		});
	});

	describe('durationToMilliseconds', () => {
		it('converts a compound duration to milliseconds', () => {
			const duration: HumanDuration = {
				years: 1,
				months: 1,
				weeks: 1,
				days: 1,
				hours: 1,
				minutes: 1,
				seconds: 1,
				milliseconds: 1,
			};
			expect(durationToMilliseconds(duration)).toBe(
				((((365 + 30 + 7 + 1) * 24 + 1) * 60 + 1) * 60 + 1) * 1000 + 1,
			);
		});

		const durations: HumanDuration[] = [
			{ years: 1 },
			{ months: 1 },
			{ weeks: 1 },
			{ days: 1 },
			{ hours: 1 },
			{ minutes: 1 },
			{ seconds: 1 },
			{ milliseconds: 1 },
		];
		it.each(durations)('computes milliseconds like luxon does, %p', (d) => {
			expect(Duration.fromObject(d).as('milliseconds')).toEqual(
				durationToMilliseconds(d),
			);
		});
	});
});
