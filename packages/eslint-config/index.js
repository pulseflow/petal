import { hasConfig } from '@flowr/petal-utils';
import base from '@flowr/eslint-config-base';
import react from '@flowr/eslint-config-react';
import typescript from '@flowr/eslint-config-typescript';
import petal from '@flowr/eslint-plugin-petal';
import prettier from 'eslint-config-prettier';
import jest from 'eslint-plugin-jest';
import globals from 'globals';

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

/** @type {import('eslint').Linter.FlatConfig} */
export default {
	...base,
	...(hasTypescript ? typescript : {}),
	...(hasReact ? react : {}),
	...prettier,
	...jest,
	languageOptions: {
		parser: '@typescript-eslint/parser',
		globals: {
			...globals.jest,
		},
		parserOptions: {
			ecmaVersion: 2022,
			sourceType: 'module',
		},
	},
	plugins: {
		'@flowr/petal': petal,
		petal,
		jest,
	},
	settings,
};
