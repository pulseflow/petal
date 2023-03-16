import rule from './no-discouraged-words';
import { createRuleTester } from '../../util/testHelpers';

const defaultErrorMessageWithWord = (word: string): string =>
	`Usage of the word "${word}" is strongly discouraged. Please use a different word.`;

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
			errors: [defaultErrorMessageWithWord('whitelist')],
		},
		{
			code: 'var blacklist = "";',
			errors: [defaultErrorMessageWithWord('blacklist')],
		},
		{
			code: 'var foo = blacklist => "";',
			errors: [defaultErrorMessageWithWord('blacklist')],
		},
		{
			code: 'var foo = _blacklist => "";',
			errors: [defaultErrorMessageWithWord('blacklist')],
		},
		{
			code: 'var foo = (bar: Blacklist) => "";',
			errors: [defaultErrorMessageWithWord('blacklist')],
		},
		{
			code: 'var foo = bar => "" as Blacklist;',
			errors: [defaultErrorMessageWithWord('blacklist')],
		},
		{
			code: 'var bLacKLisT = "";',
			errors: [defaultErrorMessageWithWord('blacklist')],
		},
		{
			code: 'var _blacklist = "";',
			errors: [defaultErrorMessageWithWord('blacklist')],
		},
		{
			code: 'var wordsWithBlacklistAndAfter = "";',
			errors: [defaultErrorMessageWithWord('blacklist')],
		},
		{
			code: 'var { blacklist } = {};',
			errors: [
				defaultErrorMessageWithWord('blacklist'),
				defaultErrorMessageWithWord('blacklist'),
			],
		},
		{
			code: 'var blacklist = {}; console.log(blacklist);',
			errors: [
				defaultErrorMessageWithWord('blacklist'),
				defaultErrorMessageWithWord('blacklist'),
			],
		},
		{
			code: 'var { blacklist: name } = {};',
			errors: [defaultErrorMessageWithWord('blacklist')],
		},
		{
			code: 'var { name: blacklist } = {};',
			errors: [defaultErrorMessageWithWord('blacklist')],
		},
		{
			code: 'var foo: Blacklist = "";',
			errors: [defaultErrorMessageWithWord('blacklist')],
		},
		{
			code: 'var foo = "" as Blacklist;',
			errors: [defaultErrorMessageWithWord('blacklist')],
		},
		{
			code: 'var foo = "" as Example.Blacklist;',
			errors: [defaultErrorMessageWithWord('blacklist')],
		},
		{
			code: 'var foo = "" as Blacklist.Example;',
			errors: [defaultErrorMessageWithWord('blacklist')],
		},
		{
			code: 'var foo = ""; // blacklist',
			errors: [defaultErrorMessageWithWord('blacklist')],
		},
		{
			code: 'enum Blacklist {}',
			errors: [defaultErrorMessageWithWord('blacklist')],
		},
		{
			code: 'class Blacklist {}',
			errors: [defaultErrorMessageWithWord('blacklist')],
		},
		{
			code: 'type Blacklist = {}',
			errors: [defaultErrorMessageWithWord('blacklist')],
		},
		{
			code: "/* Hello world. I'm using the discouraged word blacklist. */",
			errors: [defaultErrorMessageWithWord('blacklist')],
		},
	],
});
