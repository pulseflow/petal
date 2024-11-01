export enum Time {
	Nanosecond = 0.000001,
	Microsecond = 0.001,
	Millisecond = 1,
	Second = 1000,
	Minute = 60000,
	Hour = 3600000,
	Day = 86400000,
	Week = 604800000,
	Month = 2628000000,
	Year = 31536000000,
}

/**
 * The supported time types
 */
export enum TimeTypes {
	Second = 'second',
	Minute = 'minute',
	Hour = 'hour',
	Day = 'day',
	Week = 'week',
	Month = 'month',
	Year = 'year',
}

export const DEFAULT_UNITS: DurationFormatAssetsTime = {
	[TimeTypes.Day]: {
		1: 'day',
		DEFAULT: 'days',
	},
	[TimeTypes.Hour]: {
		1: 'hour',
		DEFAULT: 'hours',
	},
	[TimeTypes.Minute]: {
		1: 'minute',
		DEFAULT: 'minutes',
	},
	[TimeTypes.Month]: {
		1: 'month',
		DEFAULT: 'months',
	},
	[TimeTypes.Second]: {
		1: 'second',
		DEFAULT: 'seconds',
	},
	[TimeTypes.Week]: {
		1: 'week',
		DEFAULT: 'weeks',
	},
	[TimeTypes.Year]: {
		1: 'year',
		DEFAULT: 'years',
	},
};

export const DEFAULT_SEPARATORS: DurationFormatSeparators = {
	left: ' ',
	right: ' ',
};

/**
 * The duration of each time type in milliseconds
 */
const kTimeDurations: ReadonlyArray<[TimeTypes, number]> = [
	[TimeTypes.Year, 31536000000],
	// 29.53059 days is the official duration of a month: https://en.wikipedia.org/wiki/Month
	[TimeTypes.Month, 2628000000],
	[TimeTypes.Week, 1000 * 60 * 60 * 24 * 7],
	[TimeTypes.Day, 1000 * 60 * 60 * 24],
	[TimeTypes.Hour, 1000 * 60 * 60],
	[TimeTypes.Minute, 1000 * 60],
	[TimeTypes.Second, 1000],
];

/**
 * Display the duration
 * @param duration The duration in milliseconds to parse and display
 * @param assets The language assets
 */
export class DurationFormatter {
	public constructor(public units: DurationFormatAssetsTime = DEFAULT_UNITS) {}

	public format(
		duration: number,
		precision = 7,
		{
			left: leftSeparator = DEFAULT_SEPARATORS.left,
			right: rightSeparator = DEFAULT_SEPARATORS.right,
		}: DurationFormatSeparators = DEFAULT_SEPARATORS,
	): string {
		const output: string[] = [];
		const negative = duration < 0;
		if (negative)
			duration *= -1;

		for (const [type, timeDuration] of kTimeDurations) {
			const division = duration / timeDuration;
			if (division < 1)
				continue;

			const floored = Math.floor(division);
			duration -= floored * timeDuration;
			output.push(addUnit(floored, this.units[type], leftSeparator!));

			// If the output has enough precision, break
			if (output.length >= precision)
				break;
		}

		return `${negative ? '-' : ''}${output.join(rightSeparator) || addUnit(0, this.units.second, leftSeparator!)}`;
	}
}

/**
 * Adds an unit, if non zero
 * @param time The duration of said unit
 * @param unit The unit language assets
 */
function addUnit(time: number, unit: DurationFormatAssetsUnit, separator: string): string {
	if (Reflect.has(unit, time))
		return `${time}${separator}${Reflect.get(unit, time)}`;
	return `${time}${separator}${unit.DEFAULT}`;
}

export interface DurationFormatSeparators {
	left?: string;
	right?: string;
}

export interface DurationFormatAssetsUnit extends Record<number, string> {
	DEFAULT: string;
}

export interface DurationFormatAssetsTime {
	[TimeTypes.Second]: DurationFormatAssetsUnit;
	[TimeTypes.Minute]: DurationFormatAssetsUnit;
	[TimeTypes.Hour]: DurationFormatAssetsUnit;
	[TimeTypes.Day]: DurationFormatAssetsUnit;
	[TimeTypes.Week]: DurationFormatAssetsUnit;
	[TimeTypes.Month]: DurationFormatAssetsUnit;
	[TimeTypes.Year]: DurationFormatAssetsUnit;
}
