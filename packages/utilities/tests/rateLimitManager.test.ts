import { setTimeout as sleep } from 'node:timers/promises';
import { RateLimitManager } from '../src/lib/rateLimitManager';
import { TimerManager } from '../src/lib/timerManager';

describe('rateLimitManager', () => {
	afterEach(() => TimerManager.destroy());

	it('acquiring', () => {
		const manager = new RateLimitManager(1000, 1);

		const ratelimit1 = manager.acquire('one');
		const ratelimit2 = manager.acquire('two');
		expect(ratelimit1).toBe(manager.get('one'));
		expect(ratelimit2).toBe(manager.get('two'));
	});

	it('basic Consume', () => {
		const manager = new RateLimitManager(30000, 2);

		const ratelimit = manager.acquire('one');
		ratelimit.consume().consume();
		expect(() => ratelimit.consume()).toThrow('Cannot consume a limited bucket');
	});

	it('proper resetting', async () => {
		const manager = new RateLimitManager(1000, 2);

		const ratelimit = manager.acquire('one');
		ratelimit.consume().consume();

		expect(ratelimit.limited).toBe(true);

		// Sleep for 1.2 seconds because of how timers work.
		await sleep(1200);

		expect(ratelimit.limited).toBe(false);
		expect(() => ratelimit.consume()).not.toThrow();
	});

	it('proper sweeping (everything)', async () => {
		const manager = new RateLimitManager(1000, 2);

		manager.acquire('one').consume();

		// Sleep for 1.2 seconds because of how timers work.
		await sleep(1200);
		manager.sweep();

		expect(manager.has('one')).toBe(false);
		expect(manager.sweepInterval).toBeNull();
	});

	it('proper sweeping (not everything)', async () => {
		const manager = new RateLimitManager(1000, 2);

		manager.acquire('one').consume();

		// Sleep for 1.2 seconds because of how timers work.
		await sleep(1200);
		manager.acquire('two').consume();
		manager.sweep();

		expect(manager.has('one')).toBe(false);
		expect(manager.has('two')).toBe(true);
		expect(manager.sweepInterval).not.toBeNull();
	});
});
