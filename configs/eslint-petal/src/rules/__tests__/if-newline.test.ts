import { RuleTester } from '../../../vendor/rule-tester/src/RuleTester.js';
import rule, { RULE_NAME } from '../if-newline.js';

const valids = [
  `if (true)
  console.log('hello')
`,
  `if (true) {
  console.log('hello')
}`,
];
const invalids = [
	['if (true) console.log(\'hello\')', 'if (true) \nconsole.log(\'hello\')'],
];

const ruleTester: RuleTester = new RuleTester({
	parser: require.resolve('@typescript-eslint/parser'),
});

ruleTester.run(RULE_NAME, rule as any, {
	valid: valids,
	invalid: invalids.map(i => ({
		code: i[0],
		output: i[1],
		errors: [{ messageId: 'missingIfNewline' }],
	})),
});
