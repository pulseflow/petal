import type { InvalidTestCase, ValidTestCase } from 'eslint-vitest-rule-tester';
import { run } from './_test';
import rule, { RULE_NAME } from './no-only-tests';

const valids: ValidTestCase[] = [
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
	{
		options: [{ blocks: ['it'] }],
		code: 'test.only("options will exclude this", () => {});',
	},
	{
		options: [{ focus: ['focus'] }],
		code: 'test.only("Options will exclude this from being caught", function() {});',
	},
	{
		options: [{ functions: ['fit', 'xit'] }],
		code: 'it("Options will exclude this from being caught", function() {});',
	},
];

const invalids: InvalidTestCase[] = [
	{
		code: 'describe.only("Some describe block", function() {});',
		output: 'describe("Some describe block", function() {});',
	},
	{
		code: 'it.only("Some assertion", function() {});',
		output: 'it("Some assertion", function() {});',
	},
	{
		code: 'context.only("Some context", function() {});',
		output: 'context("Some context", function() {});',
	},
	{
		code: 'test.only("Some test", function() {});',
		output: 'test("Some test", function() {});',
	},
	{
		code: 'tape.only("A tape", function() {});',
		output: 'tape("A tape", function() {});',
	},
	{
		code: 'fixture.only("A fixture", function() {});',
		output: 'fixture("A fixture", function() {});',
	},
	{
		code: 'serial.only("A serial test", function() {});',
		output: 'serial("A serial test", function() {});',
	},
	{
		options: [{ blocks: ['obscureTestBlock'] }],
		code: 'obscureTestBlock.only("An obscure testing library test", function() {});',
		output: 'obscureTestBlock("An obscure testing library test", function() {});',
	},
	{
		options: [{ blocks: ['ava.default'] }],
		code: 'ava.default.only("Block with dot", function() {});',
		output: 'ava.default("Block with dot", function() {});',
	},
	{
		code: 'it.default.before(console.log).only("Some describe block", function() {});',
		output: 'it.default.before(console.log)("Some describe block", function() {});',
	},
	{
		options: [{ focus: ['focus'] }],
		code: 'test.focus("An alternative focus function", function() {});',
		output: 'test("An alternative focus function", function() {});',
	},
	{
		code: 'describe.only("Some describe block", function() {});',
		output: 'describe("Some describe block", function() {});',
	},
	{
		code: 'it.only("Some assertion", function() {});',
		output: 'it("Some assertion", function() {});',
	},
	{
		code: 'context.only("Some context", function() {});',
		output: 'context("Some context", function() {});',
	},
	{
		code: 'test.only("Some test", function() {});',
		output: 'test("Some test", function() {});',
	},
	{
		code: 'tape.only("A tape", function() {});',
		output: 'tape("A tape", function() {});',
	},
	{
		code: 'fixture.only("A fixture", function() {});',
		output: 'fixture("A fixture", function() {});',
	},
	{
		code: 'serial.only("A serial test", function() {});',
		output: 'serial("A serial test", function() {});',
	},
	{
		options: [{ blocks: ['obscureTestBlock'] }],
		code: 'obscureTestBlock.only("An obscure testing library test", function() {});',
		output: 'obscureTestBlock("An obscure testing library test", function() {});',
	},
	{
		options: [{ blocks: ['ava.default'] }],
		code: 'ava.default.only("Block with dot", function() {});',
		output: 'ava.default("Block with dot", function() {});',
	},
	{
		code: 'it.default.before(console.log).only("Some describe block", function() {});',
		output: 'it.default.before(console.log)("Some describe block", function() {});',
	},
	{
		options: [{ focus: ['focus'] }],
		code: 'test.focus("An alternative focus function", function() {});',
		output: 'test("An alternative focus function", function() {});',
	},
	{
		options: [{ blocks: ['test*'] }],
		code: 'testResource.only("A test resource block", function() {});',
		output: 'testResource("A test resource block", function() {});',
	},
	{
		code: 'Feature.only("Some Feature", function() {});',
		output: 'Feature("Some Feature", function() {});',
	},
	{
		code: 'Scenario.only("Some Scenario", function() {});',
		output: 'Scenario("Some Scenario", function() {});',
	},
	{
		code: 'Given.only("Some assertion", function() {});',
		output: 'Given("Some assertion", function() {});',
	},
	{
		code: 'And.only("Some assertion", function() {});',
		output: 'And("Some assertion", function() {});',
	},
	{
		code: 'When.only("Some assertion", function() {});',
		output: 'When("Some assertion", function() {});',
	},
	{
		code: 'Then.only("Some assertion", function() {});',
		output: 'Then("Some assertion", function() {});',
	},
	{
		options: [{ functions: ['fit', 'xit'] }],
		code: 'xit("No skipped tests", function() {});',
		errors: [{ messageId: 'noOnlyFunction' }],
	},
];

run({
	name: RULE_NAME,
	rule,

	valid: valids,
	invalid: invalids.map((i) => {
		if (typeof i !== 'string' && !('errors' in i))
			i.errors = [{ messageId: 'noOnlyTests' }];

		return i;
	}),
});
