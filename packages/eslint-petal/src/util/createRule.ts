import { ESLintUtils } from '@typescript-eslint/utils';

// eslint-disable-next-line new-cap
export const createRule = ESLintUtils.RuleCreator(
	name =>
		`https://github.com/pulseflow/petal/blob/main/packages/eslint-petal/src/rules/${name}.md`,
);
