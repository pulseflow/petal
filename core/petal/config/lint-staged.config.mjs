import process from 'node:process';

const tests = process.env.PETAL_RUN_TESTS === 'true';
const jestConfig = process.env.PETAL_JEST_CONFIG || "";
const eslintConfig = process.env.PETAL_ESLINT_CONFIG || "";

const testRelatedChanges = `jest ${
	jestConfig ? `--config ${jestConfig} ` : ''
}--bail --findRelatedTests --passWithNoTests`;

const lintRelatedChanges = `eslint --fix ${
	eslintConfig ? `--config ${eslintConfig}` : ''
}`.trim();

export const config = {
	'*.{js,jsx,ts,tsx,json,md,yaml}': [
		lintRelatedChanges,
		...(tests ? [testRelatedChanges] : []),
	],
};

export default config;
