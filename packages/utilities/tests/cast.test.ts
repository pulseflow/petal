import { cast } from '../src';

describe('cast', () => {
	it('given single generic type parameter then gives cast type back', () => {
		expect(cast<string>(5)).toEqual(5);
	});

	it('given two generic types parameters then gives cast type back', () => {
		expect(cast<string>('5')).toEqual('5');
	});
});
