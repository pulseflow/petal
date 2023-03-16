import path from 'path';
import { Rule } from 'eslint';

type RulesInput = string[];
type RulesOutput = { [key: string]: Rule.RuleModule };

const exportRules = (rulesInput: RulesInput): RulesOutput => {
	return rulesInput.reduce(
		(rulesOutput, rule) => ({
			...rulesOutput,
			[rule]: require(`./${path.join('./rules/', rule)}`).default,
		}),
		{} as RulesOutput,
	);
};

module.exports = {
	rules: exportRules(['best-practices/no-discouraged-words']),
};
