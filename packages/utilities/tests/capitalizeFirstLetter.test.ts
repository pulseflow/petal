import { capitalizeFirstLetter } from '../src/lib/capitalizeFirstLetter';

describe('capitalizeFirstLetter', () => {
	it('given single word then first letter is capitalized', () => {
		expect(capitalizeFirstLetter('hello')).toEqual('Hello');
	});

	it('given multi-word string then only first letter of first word is capitalized', () => {
		expect(capitalizeFirstLetter('hello world')).toEqual('Hello world');
	});

	it('given string starting with number then returns same string', () => {
		expect(capitalizeFirstLetter('1hello')).toEqual('1hello');
	});

	it('given string starting with special character then returns same string', () => {
		expect(capitalizeFirstLetter('$hello')).toEqual('$hello');
	});

	it('given empty string then returns empty string', () => {
		expect(capitalizeFirstLetter('')).toEqual('');
	});

	it('given string starting with capital letter then returns same string', () => {
		expect(capitalizeFirstLetter('Hello')).toEqual('Hello');
	});
});
