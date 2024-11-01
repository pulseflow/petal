import rule, { RULE_NAME } from '../../src/rules/no-import-dist';
import { run } from '../utilities';

const valids = [
	'import xxx from "a"',
	'import "b"',
	'import "floating-vue/dist/foo.css"',
];

const invalids = [
	'import a from "../dist/a"',
	'import "../dist/b"',
	'import b from \'dist\'',
	'import c from \'./dist\'',
];

run({
	invalid: invalids.map(i => ({
		code: i,
		errors: [{ messageId: 'noImportDist' }],
	})),
	name: RULE_NAME,
	rule,
	valid: valids,
});
