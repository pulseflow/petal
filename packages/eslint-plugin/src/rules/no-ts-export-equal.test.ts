import { run } from './_test';
import rule, { RULE_NAME } from './no-ts-export-equal';

run({
	name: RULE_NAME,
	rule,
	valid: [
		{ code: 'export default {}', filename: 'test.ts' },
		{ code: 'export = {}', filename: 'test.js' },
	],
	invalid: [
		{
			code: 'export = {}',
			filename: 'test.ts',
			errors: [{ messageId: 'noTsExportEqual' }],
		},
	],
});
