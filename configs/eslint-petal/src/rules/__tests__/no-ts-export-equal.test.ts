import { RuleTester } from '../../../vendor/rule-tester/src/RuleTester.js';
import rule, { RULE_NAME } from '../no-ts-export-equal.js';

const valids = [
	{ code: 'export default {}', filename: 'test.ts' },
	{ code: 'export = {}', filename: 'test.js' },
];

const invalids = [
	{ code: 'export = {}', filename: 'test.ts' },
];

const ruleTester: RuleTester = new RuleTester({
	parser: require.resolve('@typescript-eslint/parser'),
});

ruleTester.run(RULE_NAME, rule as any, {
	valid: valids,
	invalid: invalids.map(i => ({
		...i,
		errors: [{ messageId: 'noTsExportEqual' }],
	})),
});
