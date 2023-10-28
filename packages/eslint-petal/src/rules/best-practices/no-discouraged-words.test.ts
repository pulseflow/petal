import rule from './no-discouraged-words.js';
import { createRuleTester } from '../../util/ruleTester.js';

createRuleTester().run('best-practices/no-discouraged-words', rule, {
	valid: [
		{
			code: 'var foo = () => {};',
		},
		{
			code: 'var foo: String = () => {};',
		},
		{
			code: 'var foo: String = () => ({} as ExampleObject);',
		},
		{
			code: 'var black_list = "";',
		},
		{
			code: 'var foo = "blacklist";',
		},
		{
			code: "/* Hello world. I'm using no discouraged words. */",
		},
	],
	invalid: [
		{
			code: 'var whitelist = "";',
			errors: [{ messageId: 'disallowed' }],
		},
		{
			code: 'var blacklist = "";',
			errors: [{ messageId: 'disallowed' }],
		},
		{
			code: 'var foo = blacklist => "";',
			errors: [{ messageId: 'disallowed' }],
		},
		{
			code: 'var foo = _blacklist => "";',
			errors: [{ messageId: 'disallowed' }],
		},
		{
			code: 'var foo = (bar: Blacklist) => "";',
			errors: [{ messageId: 'disallowed' }],
		},
		{
			code: 'var foo = bar => "" as Blacklist;',
			errors: [{ messageId: 'disallowed' }],
		},
		{
			code: 'var bLacKLisT = "";',
			errors: [{ messageId: 'disallowed' }],
		},
		{
			code: 'var _blacklist = "";',
			errors: [{ messageId: 'disallowed' }],
		},
		{
			code: 'var wordsWithBlacklistAndAfter = "";',
			errors: [{ messageId: 'disallowed' }],
		},
		{
			code: 'var { blacklist } = {};',
			// Because this translates to '{ var blacklist: blacklist } = {}' the plugin reports the error twice
			errors: [{ messageId: 'disallowed' }, { messageId: 'disallowed' }],
		},
		{
			code: 'var blacklist = {}; console.log(blacklist);',
			// Because we're using the word twice in the syntax, it'll report twice. Maybe we can clear this up later.
			errors: [{ messageId: 'disallowed' }, { messageId: 'disallowed' }],
		},
		{
			code: 'var { blacklist: name } = {};',
			errors: [{ messageId: 'disallowed' }],
		},
		{
			code: 'var { name: blacklist } = {};',
			errors: [{ messageId: 'disallowed' }],
		},
		{
			code: 'var foo: Blacklist = "";',
			errors: [{ messageId: 'disallowed' }],
		},
		{
			code: 'var foo = "" as Blacklist;',
			errors: [{ messageId: 'disallowed' }],
		},
		{
			code: 'var foo = "" as Example.Blacklist;',
			errors: [{ messageId: 'disallowed' }],
		},
		{
			code: 'var foo = "" as Blacklist.Example;',
			errors: [{ messageId: 'disallowed' }],
		},
		{
			code: 'var foo = ""; // blacklist',
			errors: [{ messageId: 'disallowed' }],
		},
		{
			code: 'enum Blacklist {}',
			errors: [{ messageId: 'disallowed' }],
		},
		{
			code: 'class Blacklist {}',
			errors: [{ messageId: 'disallowed' }],
		},
		{
			code: 'type Blacklist = {}',
			errors: [{ messageId: 'disallowed' }],
		},
		{
			code: "/* Hello world. I'm using the discouraged word blacklist. */",
			errors: [{ messageId: 'disallowed' }],
		},
	],
});
