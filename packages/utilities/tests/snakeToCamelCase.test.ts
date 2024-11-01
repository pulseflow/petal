import { snakeToCamelCase } from '../src/lib/snakeToCamelCase';

describe('snakeToCamelCase', () => {
	it('should correctly transform snake_case to camelCase', () => {
		expect(snakeToCamelCase('hello_world')).toBe('helloWorld');
		expect(snakeToCamelCase('snake_to_camel_case')).toBe('snakeToCamelCase');
	});

	it('should correctly handle strings with multiple underscores', () => {
		expect(snakeToCamelCase('multiple__underscores')).toBe('multiple_Underscores');
		expect(snakeToCamelCase('__leading')).toBe('_Leading');
		expect(snakeToCamelCase('trailing__')).toBe('trailing__');
	});

	it('should correctly handle strings with hyphens', () => {
		expect(snakeToCamelCase('hyphen-case')).toBe('hyphenCase');
		expect(snakeToCamelCase('multiple--hyphens')).toBe('multiple-Hyphens');
		expect(snakeToCamelCase('--leading')).toBe('-Leading');
		expect(snakeToCamelCase('trailing--')).toBe('trailing--');
	});

	it('should correctly handle strings with mixed hyphens and underscores', () => {
		expect(snakeToCamelCase('mixed_case-and-hyphens')).toBe('mixedCaseAndHyphens');
	});

	it('should correctly handle uppercase letters', () => {
		expect(snakeToCamelCase('UPPER_CASE')).toBe('upperCase');
	});

	it('should return an empty string when given an empty string', () => {
		expect(snakeToCamelCase('')).toBe('');
	});
});
