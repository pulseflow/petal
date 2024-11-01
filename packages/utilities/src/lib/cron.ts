import { Time } from './durationFormatter';
import { range } from './range';

export const predefined = {
	'@annually': '0 0 1 1 *',
	'@daily': '0 0 * * *',
	'@hourly': '0 * * * *',
	'@monthly': '0 0 1 * *',
	'@weekly': '0 0 * * 0',
	'@yearly': '0 0 1 1 *',
} as const;

export const partRegex = /^(?:(\*)|(\d+)(?:-(\d+))?)(?:\/(\d+))?$/;
export const wildcardRegex = /\bh\b|\B\?\B/g;
export const allowedNum = [[0, 59], [0, 23], [1, 31], [1, 12], [0, 6]] as const;
export const cronTokens = { apr: 4, aug: 8, dec: 12, feb: 2, fri: 5, jan: 1, jul: 7, jun: 6, mar: 3, may: 5, mon: 1, nov: 11, oct: 10, sat: 6, sep: 9, sun: 0, thu: 4, tue: 2, wed: 3 } as const;
export const tokensRegex = new RegExp(Object.keys(cronTokens).join('|'), 'g');

/**
 * Handles Cron strings and generates dates based on the cron string provided.
 *
 * @see https://en.wikipedia.org/wiki/Cron
 */
export class Cron {
	public cron: string;
	public normalized: string;
	public minutes: number[];
	public hours: number[];
	public days: number[];
	public months: number[];
	public dows: number[];

	/**
	 * @param cron The cron pattern to use
	 */
	public constructor(cron: string) {
		this.cron = cron.toLowerCase();
		this.normalized = Cron.normalize(this.cron);
		[this.minutes, this.hours, this.days, this.months, this.dows] = Cron.parseString(this.normalized);
	}

	/**
	 * Get the next date that matches with the current pattern
	 * @param outset The Date instance to compare with
	 * @param origin Whether this next call is origin
	 */
	public next(outset: Date = new Date(), origin = true): Date {
		if (!this.days.includes(outset.getUTCDate()) || !this.months.includes(outset.getUTCMonth() + 1) || !this.dows.includes(outset.getUTCDay()))
			return this.next(new Date(outset.getTime() + Time.Day), false);

		if (!origin)
			return new Date(Date.UTC(outset.getUTCFullYear(), outset.getUTCMonth(), outset.getUTCDate(), this.hours[0], this.minutes[0]));

		const now = new Date(outset.getTime() + 60000);

		for (const hour of this.hours) {
			if (hour < now.getUTCHours())
				continue;
			for (const minute of this.minutes) {
				if (hour === now.getUTCHours() && minute < now.getUTCMinutes())
					continue;
				return new Date(Date.UTC(outset.getUTCFullYear(), outset.getUTCMonth(), outset.getUTCDate(), hour, minute));
			}
		}

		return this.next(new Date(outset.getTime() + Time.Day), false);
	}

	/**
	 * Returns the string that represents this cron pattern
	 *
	 * @returns The string that represents this cron pattern
	 */
	public toString(): string {
		return this.cron;
	}

	/**
	 * Normalize the pattern
	 * @param cron The pattern to normalize
	 */
	private static normalize(cron: string): string {
		if (Reflect.has(predefined, cron))
			return Reflect.get(predefined, cron);
		const now = new Date();
		cron = cron
			.split(' ')
			.map((val, i) =>
				val.replace(wildcardRegex, (match) => {
					if (match === 'h')
						return (Math.floor(Math.random() * allowedNum[i][1]) + allowedNum[i][0]).toString();

					if (match === '?')
						switch (i) {
							case 0:
								return now.getUTCMinutes().toString();
							case 1:
								return now.getUTCHours().toString();
							case 2:
								return now.getUTCDate().toString();
							case 3:
								return now.getUTCMonth().toString();
							case 4:
								return now.getUTCDay().toString();
						}

					return match;
				}),
			)
			.join(' ');
		return cron.replace(tokensRegex, match => String(Reflect.get(cronTokens, match)));
	}

	/**
	 * Parse the pattern
	 * @param cron The pattern to parse
	 */
	private static parseString(cron: string): number[][] {
		const parts = cron.split(' ');
		if (parts.length !== 5)
			throw new Error('Invalid Cron Provided');
		return parts.map((part, i) => Cron.parsePart(part, i));
	}

	/**
	 * Parse the current part
	 * @param cronPart The part of the pattern to parse
	 * @param id The id that identifies the current part
	 */
	private static parsePart(cronPart: string, id: number): number[] {
		if (cronPart.includes(',')) {
			const res: number[] = [];
			for (const part of cronPart.split(',')) res.push(...Cron.parsePart(part, id));
			return [...new Set(res)].sort((a, b) => a - b);
		}

		const [, wild, minStr, maxStr, step] = partRegex.exec(cronPart)!;
		let [min, max] = [Number.parseInt(minStr, 10), Number.parseInt(maxStr, 10)];

		// If '*', set min and max as the minimum and maximum allowed numbers:
		if (wild)
			[min, max] = allowedNum[id];
		// Else if a number was given, but not a maximum nor a step, return it
		// as only allowed value:
		else if (!max && !step)
			return [min];

		// Set min and max as the given numbers, defaulting max to the maximum
		// allowed, so min is never bigger than max:
		// This makes min and max be, in the following cases (considering minutes):
		// -> 1-2 | 1..2
		// -> 2-1 | 1..2
		// -> 1/7 | 1, 8, 15, 22, 29, 36, 43, 50, 57
		[min, max] = [min, max || allowedNum[id][1]].sort((a, b) => a - b);

		// Generate a range
		return range(min, max, Number.parseInt(step, 10) || 1);
	}
}
