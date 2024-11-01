import { toTitleCase } from '../src/lib/toTitleCase.ts';

describe('toTitleCase', () => {
	it('given basic then returns expected', () => {
		const source = toTitleCase('something');
		const expected = 'Something';
		expect(source).toBe(expected);
	});

	it('given unicode then returns expected', () => {
		const source = toTitleCase('🎈something');
		const expected = '🎈Something';
		expect(source).toBe(expected);
	});

	it('given keyword then returns expected', () => {
		const source = toTitleCase('textchannel');
		const expected = 'TextChannel';
		expect(source).toBe(expected);
	});

	it('given variant then returns expected', () => {
		const source = toTitleCase('somethingspecial', { additionalVariants: { somethingspecial: 'SomethingSpecial' } });
		const expected = 'SomethingSpecial';
		expect(source).toBe(expected);
	});

	it('given keyword WITH variant then returns expected', () => {
		const source = toTitleCase('textchannel', { additionalVariants: { somethingspecial: 'SomethingSpecial' } });
		const expected = 'TextChannel';
		expect(source).toBe(expected);
	});

	it('given keyword WITH caseSensitive then returns expected', () => {
		const source = toTitleCase('textChannel', { caseSensitive: true });
		const expected = 'Textchannel';
		expect(source).toBe(expected);
	});

	it('given variant WITH caseSensitive then returns expected', () => {
		const source = toTitleCase('somethingSpecial', { additionalVariants: { somethingspecial: 'SomethingSpecial' }, caseSensitive: true });
		const expected = 'Somethingspecial';
		expect(source).toBe(expected);
	});
});
