import { promisify } from 'node:util';
import { Stopwatch } from '../src/lib/stopwatch';

export const sleep = promisify(setTimeout);

describe('stopwatch', () => {
	describe('chainables', () => {
		it('restart', async () => {
			const stopwatch = new Stopwatch();

			await sleep(5001);
			stopwatch.stop();
			expect(stopwatch.duration >= 4990 && stopwatch.duration <= 5200).toBe(true);

			stopwatch.restart();

			await sleep(1000);
			stopwatch.stop();
			expect(stopwatch.duration >= 990 && stopwatch.duration <= 1200).toBe(true);
		}, 10000);

		it('reset', async () => {
			const stopwatch = new Stopwatch();

			await sleep(1000);
			stopwatch.stop();
			expect(stopwatch.duration >= 990 && stopwatch.duration <= 1200).toBe(true);

			stopwatch.reset();

			expect(stopwatch.duration === 0).toBe(true);
		});

		it('starting a previously stopped stopwatch', async () => {
			const stopwatch = new Stopwatch();

			await sleep(1000);
			stopwatch.stop();

			expect(stopwatch.duration >= 990 && stopwatch.duration <= 1200).toBe(true);

			stopwatch.start();

			await sleep(1000);
			stopwatch.stop();
			expect(stopwatch.duration >= 1990 && stopwatch.duration <= 2200).toBe(true);
		});

		it('stopping the same stopwatch twice', async () => {
			const stopwatch = new Stopwatch();

			await sleep(1000);
			stopwatch.stop();
			const first = stopwatch.duration;

			await sleep(1000);
			stopwatch.stop();
			const second = stopwatch.duration;
			expect(first).toBe(second);
		});
	});

	describe('stop accuracy', () => {
		it('stop accuracy (1 second)', async () => {
			const stopwatch = new Stopwatch();

			await sleep(1000);
			stopwatch.stop();
			expect(stopwatch.duration >= 990 && stopwatch.duration <= 1200).toBe(true);
		});

		it('stop accuracy (5 seconds)', async () => {
			const stopwatch = new Stopwatch();

			await sleep(5000);
			stopwatch.stop();
			expect(stopwatch.duration >= 4990 && stopwatch.duration <= 5200).toBe(true);
		}, 10000);
	});

	describe('toString', () => {
		it('toString(1 second)', async () => {
			const stopwatch = new Stopwatch();

			await sleep(1010);
			const str = stopwatch.stop().toString();
			expect(str.startsWith('1') && str.endsWith('s')).toBe(true);
		});

		it('toString(instant)', () => {
			const stopwatch = new Stopwatch();

			const str = stopwatch.stop().toString();
			expect(str.endsWith('μs')).toBe(true);
		});

		it('toString(less than a second)', async () => {
			const stopwatch = new Stopwatch();

			await sleep(100);
			const str = stopwatch.stop().toString();
			expect(str.endsWith('ms')).toBe(true);
		});
	});

	describe('running', () => {
		it('stopped', () => {
			const stopwatch = new Stopwatch().stop();

			expect(stopwatch.running).toBe(false);
		});

		it('running(constructor)', () => {
			const stopwatch = new Stopwatch();

			expect(stopwatch.running).toBe(true);
		});

		it('running(method)', () => {
			const stopwatch = new Stopwatch().start();

			expect(stopwatch.running).toBe(true);
		});
	});

	describe('duration', () => {
		it('duration(running)', async () => {
			const stopwatch = new Stopwatch();

			const first = stopwatch.duration;

			await sleep(1000);
			stopwatch.stop();
			const second = stopwatch.duration;

			expect(first < second).toBe(true);
		});
	});
});
