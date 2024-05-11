// import rule, { RULE_NAME } from './no-only-tests';
// import { run } from './_test';

// const valids = [
// 	`expect('a').toBeTruthy()`,
// ];

// const invalids = [
// 	[`expect('a').only().toBeTruthy()`, `expect('a').toBeTruthy()`],
// ];

// run({
// 	name: RULE_NAME,
// 	rule,
// 	valid: valids,
// 	invalid: invalids.map(i => ({
// 		code: i[0],
// 		output: i[1],
// 		errors: [{ messageId: 'no-only-tests' }],
// 	})),
// });
