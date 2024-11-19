import { TimerManager } from '../src/lib/timerManager';

describe('timerManager', () => {
	afterEach(() => {
		vi.clearAllTimers();
		TimerManager.destroy();
	});

	it('given "new" then  throws error', () => {
		expect(() => new TimerManager()).toThrowError('Super constructor null of TimerManager is not a constructor');
	});

	it('given setTimeout static then creates and resolves timeout', async () => {
		expect.assertions(2);

		expect(TimerManager.storedTimeouts.size).toBe(0);

		await new Promise<void>(done =>
			TimerManager.setTimeout(() => {
				expect(true).toBe(true);
				done();
			}, 20),
		);
	});

	it('given setTimeout with clear then creates but clears timeout', () => {
		expect.assertions(3);

		expect(TimerManager.storedTimeouts.size).toBe(0);

		const timer = TimerManager.setTimeout(() => {
			throw new Error('Woops, the TimerManager got into the timeout');
		}, 20_000);

		expect(TimerManager.storedTimeouts.size).toBe(1);
		TimerManager.clearTimeout(timer);
		expect(TimerManager.storedTimeouts.size).toBe(0);
	});

	it('given setInterval static then resolves given amount of times', async () => {
		expect.assertions(4);

		expect(TimerManager.storedIntervals.size).toBe(0);

		let i = 0;
		await new Promise<void>((done) => {
			const interval = TimerManager.setInterval(() => {
				if (++i < 3) {
					expect(TimerManager.storedIntervals.size).toBe(1);
				}
				else {
					TimerManager.clearInterval(interval);
					expect(TimerManager.storedIntervals.size).toBe(0);
					done();
				}
			}, 20);
		});
	});

	it('given timer+interval->destroy then removes all', () => {
		expect.assertions(8);

		expect(TimerManager.storedTimeouts.size).toBe(0);
		expect(TimerManager.storedIntervals.size).toBe(0);

		TimerManager.setTimeout(() => {
			throw new Error('Woops, the TimerManager got into the timeout');
		}, 20_000);

		expect(TimerManager.storedTimeouts.size).toBe(1);
		expect(TimerManager.storedIntervals.size).toBe(0);

		TimerManager.setInterval(() => {
			throw new Error('Woops, the TimerManager got into the interval');
		}, 20_000);

		expect(TimerManager.storedTimeouts.size).toBe(1);
		expect(TimerManager.storedIntervals.size).toBe(1);

		TimerManager.destroy();

		expect(TimerManager.storedTimeouts.size).toBe(0);
		expect(TimerManager.storedIntervals.size).toBe(0);
	});
});
