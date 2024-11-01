import rule, { RULE_NAME } from '../../src/rules/no-ts-export-equal';
import { run } from '../utilities';

run({
	invalid: [
		{
			code: 'export = {}',
			errors: [{ messageId: 'noTsExportEqual' }],
			filename: 'test.ts',
		},
	],
	name: RULE_NAME,
	rule,
	valid: [
		{ code: 'export default {}', filename: 'test.ts' },
		{ code: 'export = {}', filename: 'test.js' },
	],
});
