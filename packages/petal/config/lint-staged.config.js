const { getEslintConfig } = require('../cjs/Tasks/LintTask');
const { getPrettierConfig } = require('../cjs/Tasks/FormatTask');
const { getJestConfig } = require('../cjs/Tasks/TestTask');

const tests = process.env.PETAL_RUN_TESTS === 'true';
const jestConfig = process.env.PETAL_JEST_CONFIG || getJestConfig();
const prettierConfig = process.env.PETAL_PRETTIER_CONFIG || getPrettierConfig();
const eslintConfig = process.env.PETAL_ESLINT_CONFIG || getEslintConfig();

const testRelatedChanges = `jest ${
	jestConfig ? `--config ${jestConfig} ` : ''
}--bail --findRelatedTests --passWithNoTests`;

const lintRelatedChanges = `eslint --fix ${
	eslintConfig ? `--config ${eslintConfig}` : ''
}`.trim();

const formatRelatedChanges = `prettier --write ${
	prettierConfig ? `--config ${prettierConfig}` : ''
}`.trim();

module.exports = {
	'*.{js,jsx,ts,tsx,json,md,yaml}': [formatRelatedChanges],
	'*.{js,jsx,ts,tsx}': [
		lintRelatedChanges,
		...(tests ? [testRelatedChanges] : []),
	],
};
