import { pollSync } from '../src';

describe('pollSync', () => {
	const pass = 'success!';
	const fail = 'fail!';
	const cbRaw = () => pass;
	const cbConditionRaw = (result: string) => result === pass;

	it('given a poll with no retries then returns first attempt', () => {
		const cb = vi.fn(() => pass);
		const cbCondition = vi.fn(cbConditionRaw);
		const result = pollSync(cb, cbCondition, { maximumRetries: 0 });

		expect(result).toBe(pass);
		expect(cb).toBeCalledTimes(1);
		expect(cbCondition).toBeCalledTimes(0);
	});

	it('given a function that fails twice then succeeds then calls that function thrice', () => {
		const cb = vi
			.fn() //
			.mockReturnValueOnce(fail)
			.mockReturnValueOnce(fail)
			.mockReturnValueOnce(pass);
		const cbCondition = vi.fn(cbConditionRaw);
		const result = pollSync(cb, cbCondition);

		expect(result).toBe(pass);
		expect(cb).toBeCalledTimes(3);
		expect(cbCondition).toBeCalledTimes(3);
	});

	describe('maximumRetries', () => {
		const cb = () => pass;

		it.each([undefined, null, 0, 5, Infinity])('given %j then passes validation', (maximumRetries) => {
			const result = pollSync(cb, cbConditionRaw, { maximumRetries });
			expect(result).toBe(pass);
		});

		it.each(['foo', true])('given %j then throws TypeError', (maximumRetries) => {
			// @ts-expect-error: invalid type
			const callback = () => pollSync(cb, cbConditionRaw, { maximumRetries });
			expect(callback).toThrowError(new TypeError('Expected maximumRetries to be a number'));
		});

		it.each([Number.NaN, -Number.NaN, -Infinity, -5])('given %j then throws RangeError', (maximumRetries) => {
			const callback = () => pollSync(cb, cbConditionRaw, { maximumRetries });
			expect(callback).toThrowError(new RangeError('Expected maximumRetries to be a non-negative number'));
		});

		it('given a poll with only one retry and fails both then calls that function twice, but condition only once', () => {
			const cb = vi
				.fn() //
				.mockReturnValueOnce(fail)
				.mockReturnValueOnce(fail);
			const cbCondition = vi.fn((result: string) => result === pass);
			const result = pollSync(cb, cbCondition, { maximumRetries: 1 });

			expect(result).toBe(fail);
			expect(cb).toBeCalledTimes(2);
			expect(cbCondition).toBeCalledTimes(1);
		});

		it('given a poll with two retries and succeeds first then calls that function and condition once', () => {
			const cb = vi.fn(() => pass);
			const cbCondition = vi.fn((result: string) => result === pass);
			const result = pollSync(cb, cbCondition, { maximumRetries: 2 });

			expect(result).toBe(pass);
			expect(cb).toBeCalledTimes(1);
			expect(cbCondition).toBeCalledTimes(1);
		});
	});

	describe('waitBetweenRetries', () => {
		it.each([undefined, null, 0, 5])('given %j then passes validation', (waitBetweenRetries) => {
			const cb = vi.fn(cbRaw);
			const cbCondition = vi.fn(cbConditionRaw);
			const result = pollSync(cb, cbCondition, { waitBetweenRetries });

			expect(result).toBe(pass);
			expect(cb).toBeCalledTimes(1);
			expect(cbCondition).toBeCalledTimes(1);
		});

		it.each(['foo', true])('given %j then throws TypeError', (waitBetweenRetries) => {
			const cb = vi.fn(cbRaw);
			const cbCondition = vi.fn(cbConditionRaw);
			const callback = () => pollSync(cb, cbCondition, { waitBetweenRetries: waitBetweenRetries as any });

			expect(callback).toThrowError(new TypeError('Expected waitBetweenRetries to be a number'));
			expect(cb).toBeCalledTimes(0);
			expect(cbCondition).toBeCalledTimes(0);
		});

		it.each([Number.NaN, -Number.NaN, -Infinity, -5, Infinity, 5.5])('given %j then throws RangeError', (waitBetweenRetries) => {
			const cb = vi.fn(cbRaw);
			const cbCondition = vi.fn(cbConditionRaw);
			const callback = () => pollSync(cb, cbCondition, { waitBetweenRetries });

			expect(callback).toThrowError(new RangeError('Expected waitBetweenRetries to be a positive safe integer'));
			expect(cb).toBeCalledTimes(0);
			expect(cbCondition).toBeCalledTimes(0);
		});

		it('given a poll with a wait of 5ms then waits 5ms between retries', () => {
			const cb = vi
				.fn() //
				.mockReturnValueOnce(fail)
				.mockReturnValueOnce(pass);
			const cbCondition = vi.fn(cbConditionRaw);
			const dateNow = vi
				.spyOn(Date, 'now')
				.mockReturnValueOnce(0) // start
				.mockReturnValueOnce(0) // sleepSync start
				.mockReturnValueOnce(5) // sleepSync end
				.mockReturnValueOnce(5) // sleepSync start
				.mockReturnValueOnce(10); // sleepSync end
			const result = pollSync(cb, cbCondition, { waitBetweenRetries: 5 });

			expect(result).toBe(pass);
			expect(dateNow).toBeCalledTimes(5);
		});
	});

	describe('timeout', () => {
		const cb = () => pass;

		it.each([undefined, null, 0, 5, Infinity])('given %j then passes validation', (timeout) => {
			const result = pollSync(cb, cbConditionRaw, { timeout });
			expect(result).toBe(pass);
		});

		it.each(['foo', true])('given %j then throws TypeError', (timeout) => {
			// @ts-expect-error: invalid type
			const callback = () => pollSync(cb, cbConditionRaw, { timeout });
			expect(callback).toThrowError(new TypeError('Expected timeout to be a number'));
		});

		it.each([Number.NaN, -Number.NaN, -Infinity, -5])('given %j then throws RangeError', (timeout) => {
			const callback = () => pollSync(cb, cbConditionRaw, { timeout });
			expect(callback).toThrowError(new RangeError('Expected timeout to be a non-negative number'));
		});

		it('given a poll with 5ms timeout but takes longer then throws an error', () => {
			const cb = vi
				.fn() //
				.mockReturnValueOnce(fail)
				.mockReturnValueOnce(fail);
			const cbCondition = vi.fn((result: string) => result === pass);
			const dateNow = vi
				.spyOn(Date, 'now')
				.mockReturnValueOnce(0) // start
				.mockReturnValueOnce(0) // sleepSync start
				.mockReturnValueOnce(5) // sleepSync end
				.mockReturnValueOnce(5) // sleepSync start
				.mockReturnValueOnce(10) // sleepSync end
				.mockReturnValueOnce(10);
			const callback = () => pollSync(cb, cbCondition, { timeout: 5, waitBetweenRetries: 5 });

			expect(callback).toThrowError(new DOMException('This operation was aborted', 'AbortError'));
			expect(cb).toBeCalledTimes(2);
			expect(cbCondition).toBeCalledTimes(2);
			expect(dateNow).toBeCalledTimes(6);
		});
	});

	describe('verbose', () => {
		it('given verbose but no waitBetweenRetries then does not call console.log', () => {
			const cb = vi.fn().mockReturnValueOnce(fail).mockReturnValueOnce(pass);
			const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => undefined);
			const result = pollSync(cb, cbConditionRaw, { verbose: true });

			expect(result).toBe(pass);
			expect(consoleLog).toHaveBeenCalledTimes(0);
		});

		it('given verbose and waitBetweenRetries then calls console.log on retry', () => {
			const cb = vi.fn().mockReturnValueOnce(fail).mockReturnValueOnce(pass);
			const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => undefined);
			const result = pollSync(cb, cbConditionRaw, { verbose: true, waitBetweenRetries: 5 });

			expect(result).toBe(pass);
			expect(consoleLog).toHaveBeenCalledTimes(1);
			expect(consoleLog).toHaveBeenCalledWith('Waiting 5ms before polling again...');
		});
	});
});
