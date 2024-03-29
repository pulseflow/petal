import type { InvalidTestCase } from './InvalidTestCase.js';
import type { RuleTesterConfig } from './RuleTesterConfig.js'
import type { ValidTestCase } from './ValidTestCase.js'

export type Mutable<T> = {
	-readonly [P in keyof T]: T[P];
}
export type TesterConfigWithDefaults = Mutable<
	Required<Pick<RuleTesterConfig, 'defaultFilenames' | 'parser' | 'rules'>> &
	Pick<RuleTesterConfig, 'overrides' | 'env' | 'globals'> &
	RuleTesterConfig
>

export interface RunTests<
	TMessageIds extends string,
	TOptions extends Readonly<unknown[]>,
> {
	readonly valid: readonly (ValidTestCase<TOptions> | string)[]
	readonly invalid: readonly InvalidTestCase<TMessageIds, TOptions>[]
}

export interface NormalizedRunTests<
	TMessageIds extends string,
	TOptions extends Readonly<unknown[]>,
> {
	readonly valid: readonly ValidTestCase<TOptions>[]
	readonly invalid: readonly InvalidTestCase<TMessageIds, TOptions>[]
}

export type { ValidTestCase } from './ValidTestCase.js'
export type {
	InvalidTestCase,
	SuggestionOutput,
	TestCaseError,
} from './InvalidTestCase.js'
export type { RuleTesterConfig } from './RuleTesterConfig.js'
