import { roundNumber } from '../src';

describe('roundNumber', () => {
	it('given number without decimals then returns number', () => {
		expect(roundNumber(5)).toEqual(5);
	});

	it('given number with decimals that round down then returns floored number', () => {
		expect(roundNumber(5.3346353526)).toEqual(5);
	});

	it('given number with decimals that round up then returns ceiled number', () => {
		expect(roundNumber(5.6556697864)).toEqual(6);
	});

	it('given number with decimals that round up (2) then returns ceiled number', () => {
		expect(roundNumber(4.365, 2)).toEqual(4.37);
	});

	it('given negative number with decimals that round up (2) then returns ceiled number', () => {
		expect(roundNumber(-4.365, 2)).toEqual(-4.36);
	});

	it('given number with positive exponent then returns exponent scaled number', () => {
		expect(roundNumber('10e5')).toEqual(1000000);
	});

	it('given number with negative exponent then returns 0', () => {
		expect(roundNumber('10e-5')).toEqual(0);
	});

	it('given number with negative exponent and many decimals then returns exponent scaled number', () => {
		expect(roundNumber('10e-5', 10)).toEqual(0.0001);
	});
});
