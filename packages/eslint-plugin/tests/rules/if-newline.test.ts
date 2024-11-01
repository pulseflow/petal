import rule, { RULE_NAME } from '../../src/rules/if-newline';
import { run } from '../utilities';

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

run({
	invalid: invalids.map(i => ({
		code: i[0],
		errors: [{ messageId: 'missingIfNewline' }],
		output: i[1],
	})),
	name: RULE_NAME,
	rule,
	valid: valids,
});
