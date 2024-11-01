import { sleep, throttle } from '../src';

describe('throttle', () => {
	it('given number callback then returns the same output until the delay', async () => {
		const callback = vi.fn((num: number) => num);

		const throttleFunc = throttle(callback, 50);
		const now = Date.now();
		expect(throttleFunc(now)).toEqual(now);
		expect(throttleFunc(100)).toEqual(now);
		expect(callback).toHaveBeenCalledOnce();
		await sleep(100);
		expect(throttleFunc(250)).toEqual(250);
	});

	it('given number callback then returns the new output when flush', () => {
		const callback = vi.fn((num: number) => num);

		const throttleFunc = throttle(callback, 100);
		const now = Date.now();
		expect(throttleFunc(now)).toEqual(now);
		throttleFunc.flush();
		expect(throttleFunc(100)).toEqual(100);
		expect(callback).toHaveBeenCalledTimes(2);
	});
});
