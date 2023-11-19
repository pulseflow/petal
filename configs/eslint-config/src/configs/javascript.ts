import globals from 'globals';
import type {
	ConfigItem,
	OptionsIsInEditor,
	OptionsOverrides,
} from '../types.js';
import { pluginPetal, pluginUnusedImports } from '../plugins.js';
import { GLOB_SRC, GLOB_SRC_EXT } from '../globs.js';

export function javascript(options: OptionsIsInEditor & OptionsOverrides = {}): ConfigItem[] {
	const { isInEditor = false, overrides = {} } = options;

	return [
		{
			languageOptions: {
				ecmaVersion: 'latest',
				globals: {
					...globals.browser,
					...globals.es2021,
					...globals.node,
					document: 'readonly',
					navigator: 'readonly',
					window: 'readonly',
				},
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
					ecmaVersion: 'latest',
					sourceType: 'module',
				},
				sourceType: 'module',
			},
			linterOptions: {
				reportUnusedDisableDirectives: true,
			},
			name: 'petal:javascript',
			plugins: {
				'petal': pluginPetal,
				'unused-imports': pluginUnusedImports,
			},
			rules: {
				// require parens in arrow function arguments
				'arrow-parens': 0,
				// require space before/after arrow function's arrow
				'arrow-spacing': 0,
				// verify super() callings in constructors
				'constructor-super': 0,
				// enforce the spacing around the * in generator functions
				'generator-star-spacing': 0,
				// disallow modifying variables of class declarations
				'no-class-assign': 0,
				// disallow modifying variables that are declared using const
				'no-const-assign': 2,
				// disallow to use this/super before super() calling in constructors.
				'no-this-before-super': 0,
				// disallow empty constructors and constructors that only delegate into the parent class.
				'no-useless-constructor': 2,
				// require let or const instead of var
				'no-var': 2,
				// require method and property shorthand syntax for object literals
				'object-shorthand': 0,
				// suggest using of const declaration for variables that are never modified after declared
				'prefer-const': 2,
				// suggest using the spread operator instead of .apply()
				'prefer-spread': 0,
				// suggest using Reflect methods where applicable
				'prefer-reflect': 0,
				// suggest using template strings instead of concatenation or joining
				'prefer-template': 2,
				// disallow generator functions that do not have yield
				'require-yield': 0,
				// disallow trailing commas in object literals
				'comma-dangle': [2, 'always-multiline'],
				'no-tabs': 'off',

				'accessor-pairs': [
					'error',
					{ enforceForClassMembers: true, setWithoutGet: true },
				],

				'array-callback-return': 'error',
				'block-scoped-var': 'error',
				'default-case-last': 'error',
				'dot-notation': ['error', { allowKeywords: true }],
				'eqeqeq': ['error', 'smart'],
				'new-cap': [
					'error',
					{ capIsNew: false, newIsCap: true, properties: true },
				],
				'no-alert': 'error',
				'no-array-constructor': 'error',
				'no-async-promise-executor': 'error',
				'no-caller': 'error',
				'no-case-declarations': 'error',
				'no-compare-neg-zero': 'error',
				'no-cond-assign': ['error', 'always'],
				'no-console': ['error', { allow: ['warn', 'error'] }],
				'no-control-regex': 'error',
				'no-debugger': 'error',
				'no-delete-var': 'error',
				'no-dupe-args': 'error',
				'no-dupe-class-members': 'error',
				'no-dupe-keys': 'error',
				'no-duplicate-case': 'error',
				'no-empty': ['error', { allowEmptyCatch: true }],
				'no-empty-character-class': 'error',
				'no-empty-pattern': 'error',
				'no-eval': 'error',
				'no-ex-assign': 'error',
				'no-extend-native': 'error',
				'no-extra-bind': 'error',
				'no-extra-boolean-cast': 'error',
				'no-fallthrough': 'error',
				'no-func-assign': 'error',
				'no-global-assign': 'error',
				'no-implied-eval': 'error',
				'no-import-assign': 'error',
				'no-invalid-regexp': 'error',
				'no-invalid-this': 'error',
				'no-irregular-whitespace': 'error',
				'no-iterator': 'error',
				'no-labels': [
					'error',
					{ allowLoop: false, allowSwitch: false },
				],
				'no-lone-blocks': 'error',
				'no-loss-of-precision': 'error',
				'no-misleading-character-class': 'error',
				'no-multi-str': 'error',
				'no-new': 'error',
				'no-new-func': 'error',
				'no-new-object': 'error',
				'no-new-symbol': 'error',
				'no-new-wrappers': 'error',
				'no-obj-calls': 'error',
				'no-octal': 'error',
				'no-octal-escape': 'error',
				'no-proto': 'error',
				'no-prototype-builtins': 'error',
				'no-redeclare': ['error', { builtinGlobals: false }],
				'no-regex-spaces': 'error',
				'no-restricted-globals': [
					'error',
					{ message: 'Use `globalThis` instead.', name: 'global' },
					{ message: 'Use `globalThis` instead.', name: 'self' },
				],
				'no-restricted-properties': [
					'error',
					{
						message:
							'Use `Object.getPrototypeOf` or `Object.setPrototypeOf` instead.',
						property: '__proto__',
					},
					{
						message: 'Use `Object.defineProperty` instead.',
						property: '__defineGetter__',
					},
					{
						message: 'Use `Object.defineProperty` instead.',
						property: '__defineSetter__',
					},
					{
						message:
							'Use `Object.getOwnPropertyDescriptor` instead.',
						property: '__lookupGetter__',
					},
					{
						message:
							'Use `Object.getOwnPropertyDescriptor` instead.',
						property: '__lookupSetter__',
					},
				],
				'no-restricted-syntax': [
					'error',
					'DebuggerStatement',
					'LabeledStatement',
					'WithStatement',
					'TSEnumDeclaration[const=true]',
					'TSExportAssignment',
				],
				'no-self-assign': ['error', { props: true }],
				'no-self-compare': 'error',
				'no-sequences': 'error',
				'no-shadow-restricted-names': 'error',
				'no-sparse-arrays': 'error',
				'no-template-curly-in-string': 'error',
				'no-throw-literal': 'error',
				'no-undef': 'error',
				'no-undef-init': 'error',
				'no-unexpected-multiline': 'error',
				'no-unmodified-loop-condition': 'error',
				'no-unneeded-ternary': ['error', { defaultAssignment: false }],
				'no-unreachable': 'error',
				'no-unreachable-loop': 'error',
				'no-unsafe-finally': 'error',
				'no-unsafe-negation': 'error',
				'no-unused-expressions': [
					'error',
					{
						allowShortCircuit: true,
						allowTaggedTemplates: true,
						allowTernary: true,
					},
				],
				'no-unused-vars': [
					'error',
					{
						args: 'none',
						caughtErrors: 'none',
						ignoreRestSiblings: true,
						vars: 'all',
					},
				],
				'no-use-before-define': [
					'error',
					{ classes: false, functions: false, variables: true },
				],
				'no-useless-backreference': 'error',
				'no-useless-call': 'error',
				'no-useless-catch': 'error',
				'no-useless-computed-key': 'error',
				'no-useless-rename': 'error',
				'no-useless-return': 'error',
				'no-with': 'error',
				'one-var': ['error', { initialized: 'never' }],
				'prefer-arrow-callback': [
					'error',
					{
						allowNamedFunctions: false,
						allowUnboundThis: true,
					},
				],
				'prefer-exponentiation-operator': 'error',
				'prefer-promise-reject-errors': 'error',
				'prefer-regex-literals': [
					'error',
					{ disallowRedundantWrapping: true },
				],
				'prefer-rest-params': 'error',
				'sort-imports': [
					'error',
					{
						allowSeparatedGroups: false,
						ignoreCase: false,
						ignoreDeclarationSort: true,
						ignoreMemberSort: false,
						memberSyntaxSortOrder: [
							'none',
							'all',
							'multiple',
							'single',
						],
					},
				],

				'symbol-description': 'error',
				'unicode-bom': ['error', 'never'],
				'unused-imports/no-unused-imports': isInEditor
					? 'off'
					: 'error',

				'unused-imports/no-unused-vars': [
					'error',
					{
						args: 'after-used',
						argsIgnorePattern: '^_',
						vars: 'all',
						varsIgnorePattern: '^_',
					},
				],
				'use-isnan': [
					'error',
					{ enforceForIndexOf: true, enforceForSwitchCase: true },
				],
				'valid-typeof': ['error', { requireStringLiterals: true }],
				'vars-on-top': 'error',
				'yoda': ['error', 'never'],

				...overrides,
			},
		},
		{
			files: [`scripts/${GLOB_SRC}`, `cli.${GLOB_SRC_EXT}`],
			name: 'petal:scripts-overrides',
			rules: {
				'no-console': 'off',
			},
		},
	];
}
