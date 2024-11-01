import rule, { RULE_NAME } from '../../src/rules/indent-unindent';
import { $, run } from '../utilities';

run({
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
			code: $`
				const a = $\`
				  \\t\\t\\\`foo\\\`
				  \\tbar
				\`
			`,
			description: 'should work with escapes',
			output: $`
				const a = $\`
					\\t\\t\\\`foo\\\`
					\\tbar
				\`
			`,
		},
	],
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
});
