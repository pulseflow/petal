import { intro } from './intro.js';
import { setup } from '../testUtils.js';

describe('intro', () => {
	const fixture = setup();

	it('no arguments', async () => {
		await intro({
			skipFlower: false,
			version: new Promise(resolve => resolve('0.0.0')),
			username: new Promise(resolve => resolve('user')),
		});
		expect(fixture.hasMessage('Flower:')).toBe(true);
		expect(fixture.hasMessage('welcome to  petal  v0.0.0')).toBe(true);
	});
	it('--skip-flower', async () => {
		await intro({
			skipFlower: true,
			version: new Promise(resolve => resolve('0.0.0')),
			username: new Promise(resolve => resolve('user')),
		});
		expect(fixture.length()).toEqual(1);
		expect(fixture.hasMessage('Flower:')).toBe(false);
		expect(fixture.hasMessage('initializing...')).toBe(true);
	});
});
