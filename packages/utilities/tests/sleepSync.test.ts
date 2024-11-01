import { sleepSync } from '../src';

describe('sleepSync', () => {
	it('given a number of ms then return after that time', () => {
		vi.spyOn(Date, 'now') //
			.mockReturnValueOnce(0)
			.mockReturnValueOnce(25)
			.mockReturnValueOnce(50)
			.mockReturnValueOnce(50);

		expect<undefined>(sleepSync(50)).toBe(undefined);
		expect(Date.now()).toBe(50);
	});

	it('given a number of ms and a value then return after that time with the value', () => {
		vi.spyOn(Date, 'now') //
			.mockReturnValueOnce(0)
			.mockReturnValueOnce(50)
			.mockReturnValueOnce(50);

		expect<string>(sleepSync(50, 'test')).toBe('test');
		expect(Date.now()).toBe(50);
	});
});
