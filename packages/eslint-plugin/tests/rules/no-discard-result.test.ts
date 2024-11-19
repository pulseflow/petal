import { join } from 'node:path';
import tsParser from '@typescript-eslint/parser';
import rule, { RULE_NAME } from '../../src/rules/no-discard-result';
import { $, run } from '../utilities';

run({
	invalid: [
		{
			code: $`
				import { Result } from '@flowr/result';
				function foo(): Result<string, string> {}
				foo();
			`,
			errors: [
				{
					line: 4,
					messageId: 'discardedResult',
				},
			],
			name: 'simple discard',
		},
		{
			code: $`
				import { Result } from '@flowr/result';
				async function foo(): Promise<Result<string, string>> {}
				foo();
			`,
			errors: [
				{
					line: 4,
					messageId: 'discardedResult',
				},
			],
			name: 'unawaited async function discarded',
		},
		{
			code: $`
				import { Result } from '@flowr/result';
				async function foo(): Promise<Result<string, string>> {}
				await foo();
			`,
			errors: [
				{
					line: 4,
					messageId: 'discardedResult',
				},
			],
			name: 'awaited async function discarded',
		},
		{
			code: $`
				import { Result } from '@flowr/result';
				function foo(): Promise<Result<string, string>> {}
				(
					foo(),
					await foo()
				);
			`,
			errors: [
				{
					line: 5,
					messageId: 'discardedResult',
				},
				{
					line: 6,
					messageId: 'discardedResult',
				},
			],
			name: 'double discard',
		},
		{
			code: $`
				import { Result } from '@flowr/result';
				function foo(): Promise<Result<string, string>> {}
				null ?? foo();
			`,
			errors: [
				{
					line: 4,
					messageId: 'discardedResult',
				},
			],
			name: 'potential discard (??)',
		},
	],
	name: RULE_NAME,

	parserOptions: {
		ecmaVersion: 'latest',
		parser: tsParser,
		tsconfigRootDir: join(import.meta.dirname, '../fixtures'),
		projectService: {
		},
		parserOptions: {
			tsconfigRootDir: join(import.meta.dirname, '../fixtures'),
			projectService: {
			},
		},
	},

	languageOptions: {
		parserOptions: {
			ecmaVersion: 'latest',
			parser: tsParser,
			tsconfigRootDir: join(import.meta.dirname, '../fixtures'),
			projectService: {
			},
			parserOptions: {
				tsconfigRootDir: join(import.meta.dirname, '../fixtures'),
				projectService: {
				},
			},
		},
	},
	rule,

	valid: [
		$`
			import { Result } from '@flowr/result';
			function foo(): Result<string, string> {}
			async function bar(): Promise<Result<string, string>> {}
			const x = foo();
			let y = await bar(), z = (void 0, foo());
			y = z = await bar();
			const complex = foo() && (((Math.random() > 0.5 ? foo(): await bar()) || foo()) ?? await bar());
		`,
		$`
			import { Result } from '@flowr/result';
			function foo(): Result<string, string> {}
			void foo();
		`,
		$`
			import { Result } from '@flowr/result';
			function foo(): Result<string, string> {}
			function bar(result: Result<string, string>) {}
			void bar(foo());
		`,
	],
});
