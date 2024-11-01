import { regExpEsc } from '../src';

describe('regExpEsc', () => {
	it('given hyphen then returns expected', () => {
		const source = String.raw`test-this`;
		const expected = String.raw`test\-this`;
		expect(regExpEsc(source)).toBe(expected);
	});

	it('given slash then returns expected', () => {
		const source = String.raw`test/this`;
		const expected = String.raw`test\/this`;
		expect(regExpEsc(source)).toBe(expected);
	});

	it('given back slash then returns expected', () => {
		const source = String.raw`test\this`;
		const expected = String.raw`test\\this`;
		expect(regExpEsc(source)).toBe(expected);
	});

	it('given caret then returns expected', () => {
		const source = String.raw`^test`;
		const expected = String.raw`\^test`;
		expect(regExpEsc(source)).toBe(expected);
	});

	it('given dollar then returns expected', () => {
		const source = String.raw`test$`;
		const expected = String.raw`test\$`;
		expect(regExpEsc(source)).toBe(expected);
	});

	it('given * quantifier then returns expected', () => {
		const source = String.raw`test*this`;
		const expected = String.raw`test\*this`;
		expect(regExpEsc(source)).toBe(expected);
	});

	it('given + quantifier then returns expected', () => {
		const source = String.raw`test+this`;
		const expected = String.raw`test\+this`;
		expect(regExpEsc(source)).toBe(expected);
	});

	it('given ? quantifier then returns expected', () => {
		const source = String.raw`test?this`;
		const expected = String.raw`test\?this`;
		expect(regExpEsc(source)).toBe(expected);
	});

	it('given . quantifier then returns expected', () => {
		const source = String.raw`t.this`;
		const expected = String.raw`t\.this`;
		expect(regExpEsc(source)).toBe(expected);
	});

	it('given parentheses then returns expected', () => {
		const source = String.raw`(t)`;
		const expected = String.raw`\(t\)`;
		expect(regExpEsc(source)).toBe(expected);
	});

	it('given vertical bar then returns expected', () => {
		const source = String.raw`test|this`;
		const expected = String.raw`test\|this`;
		expect(regExpEsc(source)).toBe(expected);
	});

	it('given brackets then returns expected', () => {
		const source = String.raw`[test]`;
		const expected = String.raw`\[test\]`;
		expect(regExpEsc(source)).toBe(expected);
	});

	it('given curly brackets then returns expected', () => {
		const source = String.raw`{test}`;
		const expected = String.raw`\{test\}`;
		expect(regExpEsc(source)).toBe(expected);
	});

	it('given combined then returns expected', () => {
		const source = String.raw`^(he?l*l+.)|[wW]o{,2}rld$`;
		const expected = String.raw`\^\(he\?l\*l\+\.\)\|\[wW\]o\{,2\}rld\$`;
		expect(regExpEsc(source)).toBe(expected);
	});
});
