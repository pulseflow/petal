import { run } from './_test';
import rule, { RULE_NAME } from './no-only-tests';

const valids = [
	'describe("Some describe block", function() {});',
	'it("Some assertion", function() {});',
	'xit.only("Some assertion", function() {});',
	'xdescribe.only("Some describe block", function() {});',
	'xcontext.only("A context block", function() {});',
	'xtape.only("A tape block", function() {});',
	'xtest.only("A test block", function() {});',
	'other.only("An other block", function() {});',
	'testResource.only("A test resource block", function() {});',
	'var args = {only: "test"};',
	'it("should pass meta only through", function() {});',
	'obscureTestBlock.only("An obscure testing library test works unless options are supplied", function() {});',
];

const invalids = [
	[
		'describe.only("Some describe block", function() {});',
		'describe("Some describe block", function() {});',
	],
	[
		'it.only("Some describe block", function() {});',
		'it("Some describe block", function() {});',
	],
	[
		'describe.only("Some describe block", () => {});',
		'describe("Some describe block", () => {});',
	],
];

run({
	name: RULE_NAME,
	rule,

	valid: valids,
	invalid: invalids.map(i => ({
		code: i[0],
		output: i[1],
		errors: [{ messageId: 'noOnlyTests' }],
	})),
});
