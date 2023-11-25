import { RuleTester } from '../../../vendor/rule-tester/src/RuleTester.js';
import rule, { RULE_NAME } from '../generic-spacing.js';

const valids = [
	'type Foo<T = true> = T',
	'type Foo<T extends true = true> = T',
  `
type Foo<
  T = true,
  K = false
> = T`,
  `function foo<
  T
>() {}`,
  'const foo = <T>(name: T) => name',
  `interface Log {
    foo<T>(name: T): void
  }`,
  `interface Log {
  <T>(name: T): void
}`,
`interface Foo {
  foo?: <T>(name: T) => void
}`,
`type Foo<\r\nT = true,\r\nK = false,\r\n> = T`,
`const toSortedImplementation = Array.prorotype.toSorted || function <T>(name: T): void {}`,
];
const invalids = [
	['type Foo<T=true> = T', 'type Foo<T = true> = T'],
	['type Foo<T,K> = T', 'type Foo<T, K> = T'],
	['type Foo<T=false,K=1|2> = T', 'type Foo<T = false, K = 1|2> = T', 3],
	['function foo <T>() {}', 'function foo<T>() {}'],
	[`interface Log {
  foo <T>(name: T): void
}`, `interface Log {
  foo<T>(name: T): void
}`],
] as const;

const ruleTester: RuleTester = new RuleTester({
	parser: require.resolve('@typescript-eslint/parser'),
});

ruleTester.run(RULE_NAME, rule as any, {
	valid: valids,
	invalid: invalids.map(i => ({
		code: i[0],
		output: i[1].trim(),
		errors: Array.from({ length: i[2] || 1 }, () => ({ messageId: 'genericSpacingMismatch' })),
	})),
});
