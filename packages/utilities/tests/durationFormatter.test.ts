import { DurationFormatter, Time } from '../src/lib/durationFormatter';

const formatter = new DurationFormatter();

function durationImpl(time: number, precision?: number) {
	return formatter.format(time, precision);
}

describe('durationFormatter', () => {
	it('given 1 millisecond w/o precision then shows 0 seconds', () => {
		expect(durationImpl(1)).toEqual('0 seconds');
	});

	it('given 1000 millisecond w/ precision then shows 1 second', () => {
		expect(durationImpl(1000, 5)).toEqual('1 second');
	});

	it('given 1 day, 3 hours and 2 minutes w/o precision then shows 1 day 3 hours and 2 minutes', () => {
		expect(durationImpl(Time.Day + Time.Hour * 3 + Time.Minute * 2)).toEqual('1 day 3 hours 2 minutes');
	});

	it('given 1 day, 3 hours and 2 minutes w/ precision of 2 then shows 1 day and 3 hours', () => {
		expect(durationImpl(Time.Day + Time.Hour * 3 + Time.Minute * 2, 2)).toEqual('1 day 3 hours');
	});

	it('given negative duration then prepends hyphen', () => {
		expect(durationImpl(Time.Day * -1)).toEqual('-1 day');
	});

	it('given durations higher than 1 then shows plurals', () => {
		expect(durationImpl(Time.Day * 2 + Time.Hour * 2)).toEqual('2 days 2 hours');
	});
});
