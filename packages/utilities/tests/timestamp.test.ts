import { Timestamp, type TimestampTemplateEntry } from '../src/lib/timestamp';

describe(`timestamp`, () => {
	describe(`displayAfternoon`, () => {
		// Saturday 9th March 2019, at 16:20:35:500
		const date = new Date(2019, 2, 9, 16, 20, 35, 1);

		it('given `H` then returns `16`', () => {
			const timestamp = new Timestamp(`H`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`16`);
		});

		it('given `HH` then returns `16`', () => {
			const timestamp = new Timestamp(`HH`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`16`);
		});

		it('given `h` then returns `4`', () => {
			const timestamp = new Timestamp(`h`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`4`);
		});

		it('given `hh` then returns `04`', () => {
			const timestamp = new Timestamp(`hh`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`04`);
		});

		it('given `a` then returns `pm`', () => {
			const timestamp = new Timestamp(`a`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`pm`);
		});

		it('given `A` then returns `PM`', () => {
			const timestamp = new Timestamp(`A`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`PM`);
		});

		it('given `T` then returns `4:20 PM`', () => {
			const timestamp = new Timestamp(`T`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`4:20 PM`);
		});

		it('given `t` then returns `4:20:35 pm`', () => {
			const timestamp = new Timestamp(`t`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`4:20:35 pm`);
		});

		it('given `LLL` then returns `March 09, 2019 4:20 PM`', () => {
			const timestamp = new Timestamp(`LLL`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`March 09, 2019 4:20 PM`);
		});

		it('given `lll` then returns `Mar 09, 2019 4:20 PM`', () => {
			const timestamp = new Timestamp(`lll`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`Mar 09, 2019 4:20 PM`);
		});

		it('given `LLLL` then returns `Saturday, March 09, 2019 4:20 PM`', () => {
			const timestamp = new Timestamp(`LLLL`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`Saturday, March 09, 2019 4:20 PM`);
		});

		it('given `llll` then returns `Sat Mar 09, 2019 4:20 PM`', () => {
			const timestamp = new Timestamp(`llll`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`Sat Mar 09, 2019 4:20 PM`);
		});

		it('given `LLLL` (number overload) then returns `Saturday, March 09, 2019 4:20 PM`', () => {
			const timestamp = new Timestamp(`LLLL`);
			const formatted = timestamp.display(date.valueOf());
			expect(formatted).toBe(`Saturday, March 09, 2019 4:20 PM`);
		});

		it('given `LLLL` (string overload) then returns `Saturday, March 09, 2019 4:20 PM`', () => {
			const timestamp = new Timestamp(`LLLL`);
			const formatted = timestamp.display(date.toUTCString());
			expect(formatted).toBe(`Saturday, March 09, 2019 4:20 PM`);
		});

		it('given `hh:mm:ss` then returns `04:20:35`', () => {
			const timestamp = new Timestamp(`hh:mm:ss`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`04:20:35`);
		});

		it('given `hh[ hours, ]mm[ minutes]` then returns `04 hours, 20 minutes`', () => {
			const timestamp = new Timestamp(`hh[ hours, ]mm[ minutes]`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`04 hours, 20 minutes`);
		});
	});

	describe(`displayArbitrary`, () => {
		// Saturday 9th March 2019, at 16:20:35:500
		const date = new Date(2019, 2, 9, 16, 20, 35, 1);

		it('given arbitrary `H:m` then returns `hours:minutes`', () => {
			const formatted = Timestamp.displayArbitrary(`H:m`);
			const localDate = new Date();
			expect(formatted).toBe(`${localDate.getHours()}:${localDate.getMinutes()}`);
		});

		it('given arbitrary `LLLL` and date (date overload) then returns `Saturday, March 09, 2019 4:20 PM`', () => {
			const formatted = Timestamp.displayArbitrary(`LLLL`, date);
			expect(formatted).toBe(`Saturday, March 09, 2019 4:20 PM`);
		});

		it('given arbitrary `LLLL` and date (number overload) then returns `Saturday, March 09, 2019 4:20 PM`', () => {
			const formatted = Timestamp.displayArbitrary(`LLLL`, date.valueOf());
			expect(formatted).toBe(`Saturday, March 09, 2019 4:20 PM`);
		});

		it('given arbitrary `LLLL` and date (string overload) then returns `Saturday, March 09, 2019 4:20 PM`', () => {
			const formatted = Timestamp.displayArbitrary(`LLLL`, date.toUTCString());
			expect(formatted).toBe(`Saturday, March 09, 2019 4:20 PM`);
		});
	});

	describe(`displayMorning`, () => {
		// Saturday 9th March 2019, at 4:20:35:500
		const date = new Date(2019, 2, 9, 4, 20, 35, 1);

		it('given `H` then returns `4`', () => {
			const timestamp = new Timestamp(`H`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`4`);
		});

		it('given `HH` then returns `04`', () => {
			const timestamp = new Timestamp(`HH`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`04`);
		});

		it('given `h` then returns `4`', () => {
			const timestamp = new Timestamp(`h`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`4`);
		});

		it('given `hh` then returns `04`', () => {
			const timestamp = new Timestamp(`hh`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`04`);
		});

		it('given `a` then returns `am`', () => {
			const timestamp = new Timestamp(`a`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`am`);
		});

		it('given `A` then returns `AM`', () => {
			const timestamp = new Timestamp(`A`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`AM`);
		});

		it('given `T` then returns `4:20 AM`', () => {
			const timestamp = new Timestamp(`T`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`4:20 AM`);
		});

		it('given `t` then returns `4:20:35 am`', () => {
			const timestamp = new Timestamp(`t`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`4:20:35 am`);
		});

		it('given `LLL` then returns `March 09, 2019 4:20 AM`', () => {
			const timestamp = new Timestamp(`LLL`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`March 09, 2019 4:20 AM`);
		});

		it('given `lll` then returns `Mar 09, 2019 4:20 AM`', () => {
			const timestamp = new Timestamp(`lll`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`Mar 09, 2019 4:20 AM`);
		});

		it('given `LLLL` then returns `Saturday, March 09, 2019 4:20 AM`', () => {
			const timestamp = new Timestamp(`LLLL`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`Saturday, March 09, 2019 4:20 AM`);
		});

		it('given `llll` then returns `Sat Mar 09, 2019 4:20 AM`', () => {
			const timestamp = new Timestamp(`llll`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`Sat Mar 09, 2019 4:20 AM`);
		});

		it('given `LLLL` (number overload) then returns `Saturday, March 09, 2019 4:20 AM`', () => {
			const timestamp = new Timestamp(`LLLL`);
			const formatted = timestamp.display(date.valueOf());
			expect(formatted).toBe(`Saturday, March 09, 2019 4:20 AM`);
		});

		it('given `LLLL` (string overload) then returns `Saturday, March 09, 2019 4:20 AM`', () => {
			const timestamp = new Timestamp(`LLLL`);
			const formatted = timestamp.display(date.toUTCString());
			expect(formatted).toBe(`Saturday, March 09, 2019 4:20 AM`);
		});

		it('given `hh:mm:ss` then returns `04:20:35`', () => {
			const timestamp = new Timestamp(`hh:mm:ss`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`04:20:35`);
		});

		it('given `hh[ hours, ]mm[ minutes]` then returns `04 hours, 20 minutes`', () => {
			const timestamp = new Timestamp(`hh[ hours, ]mm[ minutes]`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`04 hours, 20 minutes`);
		});
	});

	describe(`displayUTC`, () => {
		// Saturday 9th March 2019, at 16:20:35:500
		const date = new Date(2019, 2, 9, 16, 20, 35, 1);

		it('given `empty` string then `returns empty string`', () => {
			const timestamp = new Timestamp(``);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(``);
		});

		it('given `Y` then returns `19`', () => {
			const timestamp = new Timestamp(`Y`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`19`);
		});

		it('given `YY` then returns `19`', () => {
			const timestamp = new Timestamp(`YY`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`19`);
		});

		it('given `YYY` then returns `2019`', () => {
			const timestamp = new Timestamp(`YYY`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`2019`);
		});

		it('given `YYYY` then returns `2019`', () => {
			const timestamp = new Timestamp(`YYYY`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`2019`);
		});

		it('given `Q` then returns `1`', () => {
			const timestamp = new Timestamp(`Q`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`1`);
		});

		it('given `M` then returns `3`', () => {
			const timestamp = new Timestamp(`M`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`3`);
		});

		it('given `MM` then returns `03`', () => {
			const timestamp = new Timestamp(`MM`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`03`);
		});

		it('given `MMM` then returns `March`', () => {
			const timestamp = new Timestamp(`MMM`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`March`);
		});

		it('given `MMMM` then returns `March`', () => {
			const timestamp = new Timestamp(`MMMM`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`March`);
		});

		it('given `D` then returns `9`', () => {
			const timestamp = new Timestamp(`D`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`9`);
		});

		it('given `DD` then returns `09`', () => {
			const timestamp = new Timestamp(`DD`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`09`);
		});

		it('given `DDD` then returns `68`', () => {
			const timestamp = new Timestamp(`DDD`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`68`);
		});

		it('given `DDDD` then returns `68`', () => {
			const timestamp = new Timestamp(`DDDD`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`68`);
		});

		it('given `d` then returns `9th`', () => {
			const timestamp = new Timestamp(`d`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`9th`);
		});

		it('given `dd` then returns `Sa`', () => {
			const timestamp = new Timestamp(`dd`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`Sa`);
		});

		it('given `ddd` then returns `Sat`', () => {
			const timestamp = new Timestamp(`ddd`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`Sat`);
		});

		it('given `dddd` then returns `Saturday`', () => {
			const timestamp = new Timestamp(`dddd`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`Saturday`);
		});

		it('given `X` then returns the amount of seconds since EPOCH', () => {
			const timestamp = new Timestamp(`X`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe((date.getTime() / 1000).toString());
		});

		it('given `x` then returns the amount of milliseconds since EPOCH', () => {
			const timestamp = new Timestamp(`x`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(date.getTime().toString());
		});

		it('given `H` then returns `16`', () => {
			const timestamp = new Timestamp(`H`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`16`);
		});

		it('given `HH` then returns `16`', () => {
			const timestamp = new Timestamp(`HH`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`16`);
		});

		it('given `h` then returns `4`', () => {
			const timestamp = new Timestamp(`h`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`4`);
		});

		it('given `hh` then returns `04`', () => {
			const timestamp = new Timestamp(`hh`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`04`);
		});

		it('given `a` then returns `pm`', () => {
			const timestamp = new Timestamp(`a`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`pm`);
		});

		it('given `A` then returns `PM`', () => {
			const timestamp = new Timestamp(`A`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`PM`);
		});

		it('given `m` then returns `20`', () => {
			const timestamp = new Timestamp(`m`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`20`);
		});

		it('given `mm` then returns `20`', () => {
			const timestamp = new Timestamp(`mm`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`20`);
		});

		it('given `s` then returns `35`', () => {
			const timestamp = new Timestamp(`s`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`35`);
		});

		it('given `ss` then returns `35`', () => {
			const timestamp = new Timestamp(`ss`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`35`);
		});

		it('given `S` then returns `1`', () => {
			const timestamp = new Timestamp(`S`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`1`);
		});

		it('given `SS` then returns `01`', () => {
			const timestamp = new Timestamp(`SS`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`01`);
		});

		it('given `SSS` then returns `001`', () => {
			const timestamp = new Timestamp(`SSS`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`001`);
		});

		it('given `T` then returns `4:20 PM`', () => {
			const timestamp = new Timestamp(`T`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`4:20 PM`);
		});

		it('given `t` then returns `4:20:35 pm`', () => {
			const timestamp = new Timestamp(`t`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`4:20:35 pm`);
		});

		it('given `L` then returns `03/09/2019`', () => {
			const timestamp = new Timestamp(`L`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`03/09/2019`);
		});

		it('given `l` then returns `3/09/2019`', () => {
			const timestamp = new Timestamp(`l`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`3/09/2019`);
		});

		it('given `LL` then returns `March 09, 2019`', () => {
			const timestamp = new Timestamp(`LL`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`March 09, 2019`);
		});

		it('given `ll` then returns `Mar 09, 2019`', () => {
			const timestamp = new Timestamp(`ll`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`Mar 09, 2019`);
		});

		it('given `LLL` then returns `March 09, 2019 4:20 PM`', () => {
			const timestamp = new Timestamp(`LLL`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`March 09, 2019 4:20 PM`);
		});

		it('given `lll` then returns `Mar 09, 2019 4:20 PM`', () => {
			const timestamp = new Timestamp(`lll`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`Mar 09, 2019 4:20 PM`);
		});

		it('given `LLLL` then returns `Saturday, March 09, 2019 4:20 PM`', () => {
			const timestamp = new Timestamp(`LLLL`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`Saturday, March 09, 2019 4:20 PM`);
		});

		it('given `llll` then returns `Sat Mar 09, 2019 4:20 PM`', () => {
			const timestamp = new Timestamp(`llll`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`Sat Mar 09, 2019 4:20 PM`);
		});

		it('given `Z` then returns the timezone offset', () => {
			const timestamp = new Timestamp(`Z`);
			const formatted = timestamp.display(date);

			const offset = date.getTimezoneOffset();
			const unsigned = offset >= 0;
			const absolute = Math.abs(offset);
			const expected = `${unsigned ? `+` : `-`}${String(Math.floor(absolute / 60)).padStart(2, `0`)}:${String(absolute % 60).padStart(2, `0`)}`;
			expect(formatted).toBe(expected);
		});

		it('given `ZZ` then returns the timezone offset', () => {
			const timestamp = new Timestamp(`ZZ`);
			const formatted = timestamp.display(date);

			const offset = date.getTimezoneOffset();
			const unsigned = offset >= 0;
			const absolute = Math.abs(offset);
			const expected = `${unsigned ? `+` : `-`}${String(Math.floor(absolute / 60)).padStart(2, `0`)}:${String(absolute % 60).padStart(2, `0`)}`;
			expect(formatted).toBe(expected);
		});

		it('given `LLLL` (number overload) then returns `Saturday, March 09, 2019 4:20 PM`', () => {
			const timestamp = new Timestamp(`LLLL`);
			const formatted = timestamp.display(date.valueOf());
			expect(formatted).toBe(`Saturday, March 09, 2019 4:20 PM`);
		});

		it('given `LLLL` (string overload) then returns `Saturday, March 09, 2019 4:20 PM`', () => {
			const timestamp = new Timestamp(`LLLL`);
			const formatted = timestamp.display(date.toUTCString());
			expect(formatted).toBe(`Saturday, March 09, 2019 4:20 PM`);
		});

		it('given `hh:mm:ss` then returns `04:20:35`', () => {
			const timestamp = new Timestamp(`hh:mm:ss`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`04:20:35`);
		});

		it('given `hh[ hours, ]mm[ minutes]` then returns `04 hours, 20 minutes`', () => {
			const timestamp = new Timestamp(`hh[ hours, ]mm[ minutes]`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`04 hours, 20 minutes`);
		});

		it('given `d` (day: 01) then RETURNS `1st`', () => {
			const timestamp = new Timestamp(`d`);
			const formatted = timestamp.display(new Date(2019, 2, 1, 16, 20, 35, 1));
			expect(formatted).toBe(`1st`);
		});

		it('given `d` (day: 11) then RETURNS `11th`', () => {
			const timestamp = new Timestamp(`d`);
			const formatted = timestamp.display(new Date(2019, 2, 11, 16, 20, 35, 1));
			expect(formatted).toBe(`11th`);
		});

		it('given `d` (day: 21) then RETURNS `21st`', () => {
			const timestamp = new Timestamp(`d`);
			const formatted = timestamp.display(new Date(2019, 2, 21, 16, 20, 35, 1));
			expect(formatted).toBe(`21st`);
		});

		it('given `d` (day: 02) then RETURNS `2nd`', () => {
			const timestamp = new Timestamp(`d`);
			const formatted = timestamp.display(new Date(2019, 2, 2, 16, 20, 35, 1));
			expect(formatted).toBe(`2nd`);
		});

		it('given `d` (day: 12) then RETURNS `12th`', () => {
			const timestamp = new Timestamp(`d`);
			const formatted = timestamp.display(new Date(2019, 2, 12, 16, 20, 35, 1));
			expect(formatted).toBe(`12th`);
		});

		it('given `d` (day: 22) then RETURNS `22nd`', () => {
			const timestamp = new Timestamp(`d`);
			const formatted = timestamp.display(new Date(2019, 2, 22, 16, 20, 35, 1));
			expect(formatted).toBe(`22nd`);
		});

		it('given `d` (day: 03) then RETURNS `3rd`', () => {
			const timestamp = new Timestamp(`d`);
			const formatted = timestamp.display(new Date(2019, 2, 3, 16, 20, 35, 1));
			expect(formatted).toBe(`3rd`);
		});

		it('given `d` (day: 13) then RETURNS `13th`', () => {
			const timestamp = new Timestamp(`d`);
			const formatted = timestamp.display(new Date(2019, 2, 13, 16, 20, 35, 1));
			expect(formatted).toBe(`13th`);
		});

		it('given `d` (day: 23) then RETURNS `23rd`', () => {
			const timestamp = new Timestamp(`d`);
			const formatted = timestamp.display(new Date(2019, 2, 23, 16, 20, 35, 1));
			expect(formatted).toBe(`23rd`);
		});

		it('given arbitrary `H:m` casted to string then returns `hours:minutes`', () => {
			const timestamp = new Timestamp(`H:m`);
			const localDate = new Date();
			expect(timestamp.toString()).toBe(`${localDate.getHours()}:${localDate.getMinutes()}`);
		});
	});

	describe(`displayZeroes`, () => {
		// Saturday 9th March 2019, at 0:00:00:000
		const date = new Date(2019, 2, 9, 0, 0, 0, 0);

		it('given `H` then returns `0`', () => {
			const timestamp = new Timestamp(`H`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`0`);
		});

		it('given `HH` then returns `00`', () => {
			const timestamp = new Timestamp(`HH`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`00`);
		});

		it('given `h` then returns `12`', () => {
			const timestamp = new Timestamp(`h`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`12`);
		});

		it('given `hh` then returns `12`', () => {
			const timestamp = new Timestamp(`hh`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`12`);
		});

		it('given `a` then returns `am`', () => {
			const timestamp = new Timestamp(`a`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`am`);
		});

		it('given `A` then returns `AM`', () => {
			const timestamp = new Timestamp(`A`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`AM`);
		});

		it('given `T` then returns `12:00 AM`', () => {
			const timestamp = new Timestamp(`T`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`12:00 AM`);
		});

		it('given `t` then returns `12:00:00 am`', () => {
			const timestamp = new Timestamp(`t`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`12:00:00 am`);
		});

		it('given `LLL` then returns `March 09, 2019 12:00 AM`', () => {
			const timestamp = new Timestamp(`LLL`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`March 09, 2019 12:00 AM`);
		});

		it('given `lll` then returns `Mar 09, 2019 12:00 AM`', () => {
			const timestamp = new Timestamp(`lll`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`Mar 09, 2019 12:00 AM`);
		});

		it('given `LLLL` then returns `Saturday, March 09, 2019 12:00 AM`', () => {
			const timestamp = new Timestamp(`LLLL`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`Saturday, March 09, 2019 12:00 AM`);
		});

		it('given `llll` then returns `Sat Mar 09, 2019 12:00 AM`', () => {
			const timestamp = new Timestamp(`llll`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`Sat Mar 09, 2019 12:00 AM`);
		});

		it('given `LLLL` (number overload) then returns `Saturday, March 09, 2019 12:00 AM`', () => {
			const timestamp = new Timestamp(`LLLL`);
			const formatted = timestamp.display(date.valueOf());
			expect(formatted).toBe(`Saturday, March 09, 2019 12:00 AM`);
		});

		it('given LLLL (string overload) then returns `Saturday, March 09, 2019 12:00 AM`', () => {
			const timestamp = new Timestamp(`LLLL`);
			const formatted = timestamp.display(date.toUTCString());
			expect(formatted).toBe(`Saturday, March 09, 2019 12:00 AM`);
		});

		it('given `hh:mm:ss` then returns `12:00:00`', () => {
			const timestamp = new Timestamp(`hh:mm:ss`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`12:00:00`);
		});

		it('given `hh[ hours, ]mm[ minutes]` then returns `12 hours, 00 minutes`', () => {
			const timestamp = new Timestamp(`hh[ hours, ]mm[ minutes]`);
			const formatted = timestamp.display(date);
			expect(formatted).toBe(`12 hours, 00 minutes`);
		});
	});

	function extractParsedTemplate(timestamp: Timestamp): TimestampTemplateEntry[] {
		return timestamp.template;
	}

	describe(`template`, () => {
		it(`given empty template then returns empty array`, () => {
			const timestamp = new Timestamp(``);
			const parsedTemplate = extractParsedTemplate(timestamp);
			expect(parsedTemplate).toStrictEqual([]);
		});

		it('given `hh:mm:ss` then returns array with 2 literals and 3 variables', () => {
			const timestamp = new Timestamp(`hh:mm:ss`);
			const parsedTemplate = extractParsedTemplate(timestamp);
			expect(parsedTemplate).toStrictEqual([
				{
					content: null,
					type: `hh`,
				},
				{
					content: `:`,
					type: `literal`,
				},
				{
					content: null,
					type: `mm`,
				},
				{
					content: `:`,
					type: `literal`,
				},
				{
					content: null,
					type: `ss`,
				},
			]);
		});

		it('given `hh[ hours, ]mm[ minutes]` then returns array with 2 literals and 2 variables', () => {
			const timestamp = new Timestamp(`hh[ hours, ]mm[ minutes]`);
			const parsedTemplate = extractParsedTemplate(timestamp);
			expect(parsedTemplate).toStrictEqual([
				{
					content: null,
					type: `hh`,
				},
				{
					content: ` hours, `,
					type: `literal`,
				},
				{
					content: null,
					type: `mm`,
				},
				{
					content: ` minutes`,
					type: `literal`,
				},
			]);
		});

		it('given `llllll` then returns array with 2 variables', () => {
			const timestamp = new Timestamp(`llllll`);
			const parsedTemplate = extractParsedTemplate(timestamp);
			expect(parsedTemplate).toStrictEqual([
				{
					content: null,
					type: `llll`,
				},
				{
					content: null,
					type: `ll`,
				},
			]);
		});

		it('given `llllll` and updating to `llll` then returns updated templates', () => {
			const timestamp = new Timestamp(`llllll`);
			const parsedTemplate = extractParsedTemplate(timestamp);
			expect(parsedTemplate).toStrictEqual([
				{
					content: null,
					type: `llll`,
				},
				{
					content: null,
					type: `ll`,
				},
			]);

			expect(timestamp.edit(`llll`)).toBe(timestamp);

			const editedParsedTemplate = extractParsedTemplate(timestamp);
			expect(editedParsedTemplate).toStrictEqual([
				{
					content: null,
					type: `llll`,
				},
			]);
		});

		it('given `カイラ` then returns array with 1 literal', () => {
			const timestamp = new Timestamp(`カイラ`);
			const parsedTemplate = extractParsedTemplate(timestamp);
			expect(parsedTemplate).toStrictEqual([
				{
					content: `カイラ`,
					type: `literal`,
				},
			]);
		});

		it('given `][` then returns array with 2 literals', () => {
			const timestamp = new Timestamp(`][`);
			const parsedTemplate = extractParsedTemplate(timestamp);
			expect(parsedTemplate).toStrictEqual([
				{
					content: `]`,
					type: `literal`,
				},
				{
					content: `[`,
					type: `literal`,
				},
			]);
		});
	});
});
