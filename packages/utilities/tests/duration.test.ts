import { Duration } from '../src/lib/duration';
import { Time } from '../src/lib/durationFormatter';

describe('duration', () => {
	describe('units', () => {
		function expectDurationUnits(duration: Duration, units: Partial<Record<keyof Duration, number>> = {}) {
			expect(duration.nanoseconds).toEqual(units.nanoseconds ?? 0);
			expect(duration.microseconds).toEqual(units.microseconds ?? 0);
			expect(duration.milliseconds).toEqual(units.milliseconds ?? 0);
			expect(duration.seconds).toEqual(units.seconds ?? 0);
			expect(duration.minutes).toEqual(units.minutes ?? 0);
			expect(duration.hours).toEqual(units.hours ?? 0);
			expect(duration.days).toEqual(units.days ?? 0);
			expect(duration.weeks).toEqual(units.weeks ?? 0);
			expect(duration.months).toEqual(units.months ?? 0);
			expect(duration.years).toEqual(units.years ?? 0);
		}

		it.each(['0ns', '0us', '0μs', '0ms', '0s', '0m', '0h', '0d', '0w', '0mo', '0yr'])('given %s then shows 0ms', (pattern) => {
			const duration = new Duration(pattern);
			expect(duration.offset).toEqual(0);
			expectDurationUnits(duration, {});
		});

		it.each(['a nanosecond', '1ns'])('given %s then shows 1ns', (pattern) => {
			const duration = new Duration(pattern);
			expect(duration.offset).toEqual(Time.Nanosecond);
			expectDurationUnits(duration, { nanoseconds: 1 });
		});

		it.each(['a microsecond', '1us', '1μs'])('given %s then shows 1μs', (pattern) => {
			const duration = new Duration(pattern);
			expect(duration.offset).toEqual(Time.Microsecond);
			expectDurationUnits(duration, { microseconds: 1 });
		});

		it.each(['a millisecond', '1ms'])('given %s then shows 1ms', (pattern) => {
			const duration = new Duration(pattern);
			expect(duration.offset).toEqual(Time.Millisecond);
			expectDurationUnits(duration, { milliseconds: 1 });
		});

		it.each(['a second', '1s'])('given %s then shows 1s', (pattern) => {
			const duration = new Duration(pattern);
			expect(duration.offset).toEqual(Time.Second);
			expectDurationUnits(duration, { seconds: 1 });
		});

		it.each(['a minute', '1m'])('given %s then shows 1m', (pattern) => {
			const duration = new Duration(pattern);
			expect(duration.offset).toEqual(Time.Minute);
			expectDurationUnits(duration, { minutes: 1 });
		});

		it.each(['a hour', '1h'])('given %s then shows 1h', (pattern) => {
			const duration = new Duration(pattern);
			expect(duration.offset).toEqual(Time.Hour);
			expectDurationUnits(duration, { hours: 1 });
		});

		it.each(['a day', '1d'])('given %s then shows 1d', (pattern) => {
			const duration = new Duration(pattern);
			expect(duration.offset).toEqual(Time.Day);
			expectDurationUnits(duration, { days: 1 });
		});

		it.each(['a week', '1w'])('given %s then shows 1w', (pattern) => {
			const duration = new Duration(pattern);
			expect(duration.offset).toEqual(Time.Week);
			expectDurationUnits(duration, { weeks: 1 });
		});

		it.each(['a month', '1mo'])('given %s then shows 1mo', (pattern) => {
			const duration = new Duration(pattern);
			expect(duration.offset).toEqual(Time.Month);
			expectDurationUnits(duration, { months: 1 });
		});

		it.each(['a year', '1yr'])('given %s then shows 1yr', (pattern) => {
			const duration = new Duration(pattern);
			expect(duration.offset).toEqual(Time.Year);
			expectDurationUnits(duration, { years: 1 });
		});
	});

	it('given invalid duration then show NaN', () => {
		const duration = new Duration('foo');
		expect(duration.offset).toEqual(Number.NaN);
	});

	it('given duration with offset, then dateFrom is valid', () => {
		const duration = new Duration('a second');
		const date = new Date();
		expect(duration.dateFrom(date)).toEqual(new Date(date.getTime() + Time.Second));
	});
});
