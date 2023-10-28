const tests = process.env.PETAL_RUN_TESTS === 'true';
const jestConfig = process.env.PETAL_JEST_CONFIG || "";
const prettierConfig = process.env.PETAL_PRETTIER_CONFIG || "";
const eslintConfig = process.env.PETAL_ESLINT_CONFIG || "";

const testRelatedChanges = `jest ${
	jestConfig ? `--config ${jestConfig} ` : ''
}--bail --findRelatedTests --passWithNoTests`;

const lintRelatedChanges = `eslint --fix ${
	eslintConfig ? `--config ${eslintConfig}` : ''
}`.trim();

const formatRelatedChanges = `prettier --write ${
	prettierConfig ? `--config ${prettierConfig}` : ''
}`.trim();

export const config = {
	'*.{js,jsx,ts,tsx,json,md,yaml}': [formatRelatedChanges],
	'*.{js,jsx,ts,tsx}': [
		lintRelatedChanges,
		...(tests ? [testRelatedChanges] : []),
	],
};

export default config;