import { $, run } from './_test';
import rule, { RULE_NAME } from './indent-unindent';

run({
	name: RULE_NAME,
	rule,

	valid: [
		$`
			const a = $\`
				b
			\`
		`,
		$`
			const a = foo\`b\`
		`,
	],
	invalid: [
		{
			code: $`
				const a = {
					foo: $\`
					  if (true) return 1
					\`
				}
			`,
			output: $`
				const a = {
					foo: $\`
						if (true) return 1
					\`
				}
			`,
		},
		{
			code: $`
				const a = $\`
				  if (true) return 1\`
			`,
			output: $`
				const a = $\`
					if (true) return 1
				\`
			`,
		},
		{
			description: 'should work with escapes',
			code: $`
				const a = $\`
				  \\t\\t\\\`foo\\\`
				  \\tbar
				\`
			`,
			output: $`
				const a = $\`
					\\t\\t\\\`foo\\\`
					\\tbar
				\`
			`,
		},
	],
});
