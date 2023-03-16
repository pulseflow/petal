const { hasConfig } = require('@flowr/petal-utils');

const hasReact = hasConfig([
	{ type: 'dependency', dependency: 'react' },
	{ type: 'dependency', dependency: 'react', dependencyType: 'peer' },
]);
const hasTypescript = hasConfig([
	{ type: 'dependency', dependency: 'typescript' },
	{ type: 'dependency', dependency: 'typescript', dependencyType: 'dev' },
	{ type: 'file', pattern: 'tsconfig.json' },
]);

const settings = {
	jest: {
		version: 29,
	},
};

if (hasReact) {
	settings.react = {
		version: 'detect',
	};
}

/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
	extends: [
		'@flowr/eslint-config-base',
		hasReact ? '@flowr/eslint-config-react' : null,
		hasTypescript ? '@flowr/eslint-config-typescript' : null,
		'prettier',
		'plugin:jest/recommended',
	].filter(s => !!s),
	parser: '@typescript-eslint/parser',
	env: {
		jest: true,
	},
	parserOptions: {
		ecmaVersion: 2022,
		sourceType: 'module',
	},
	settings,
	plugins: ['@flowr/eslint-plugin-petal'],
};
