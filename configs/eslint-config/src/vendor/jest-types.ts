import type { RuleConfig } from '@antfu/eslint-define-config';

export type JestRules = JestRule;

type JestRuleConfig = RuleConfig<[]>;

interface JestRule {
	'jest/rule': JestRuleConfig
}
