import { makeObject } from '../src';

describe('makeObject', () => {
	it('given basic then returns expected', () => {
		const made = makeObject('hello', 'world');
		expect(made).toEqual({ hello: 'world' });
	});

	it('given nested then returns expected', () => {
		const made = makeObject('he.llo', 'world');
		expect(made).toEqual({ he: { llo: 'world' } });
	});

	it('given existing then returns expected', () => {
		const made = makeObject('hello', 'world', { he: { llo: 'world' } });
		expect(made).toEqual({ he: { llo: 'world' }, hello: 'world' });
	});

	it('given existing-nested then returns expected', () => {
		const made = makeObject('he.wor', 'ld', { he: { llo: 'world' } });
		expect(made).toEqual({ he: { llo: 'world', wor: 'ld' } });
	});
});
