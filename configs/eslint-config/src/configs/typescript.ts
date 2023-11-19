import type {
	ConfigItem,
	OptionsComponentExts,
	OptionsOverrides,
	OptionsTypeScriptParserOptions,
	OptionsTypeScriptWithTypes,
} from '../types.js';
import { GLOB_SRC } from '../globs.js';
import { parserTs, pluginPetal, pluginImport, pluginTs } from '../plugins.js';
import { renameRules, toArray } from '../utils.js';
import process from 'node:process';

export const typescript = (
	options?: OptionsComponentExts &
		OptionsOverrides &
		OptionsTypeScriptWithTypes &
		OptionsTypeScriptParserOptions,
): ConfigItem[] => {
	const {
		componentExts = [],
		overrides = {},
		parserOptions = {},
	} = options ?? {};

	const typeAwareRules: ConfigItem['rules'] = {
		'dot-notation': 'off',
		'no-implied-eval': 'off',
		'no-throw-literal': 'off',
		'ts/await-thenable': 'error',
		'ts/dot-notation': ['error', { allowKeywords: true }],
		'ts/no-floating-promises': 'error',
		'ts/no-for-in-array': 'error',
		'ts/no-implied-eval': 'error',
		'ts/no-misused-promises': 'error',
		'ts/no-throw-literal': 'error',
		'ts/no-unnecessary-type-assertion': 'error',
		'ts/no-unsafe-argument': 'error',
		'ts/no-unsafe-assignment': 'error',
		'ts/no-unsafe-call': 'error',
		'ts/no-unsafe-member-access': 'error',
		'ts/no-unsafe-return': 'error',
		'ts/restrict-plus-operands': 'error',
		'ts/restrict-template-expressions': 'error',
		'ts/unbound-method': 'error',
	};

	const tsconfigPath = options?.tsconfigPath
		? toArray(options.tsconfigPath)
		: undefined;

	return [
		{
			name: 'petal:typescript:setup',
			plugins: {
				petal: pluginPetal,
				import: pluginImport,
				ts: pluginTs as any,
			},
		},
		{
			files: [GLOB_SRC, ...componentExts.map(e => `**/*.${e}`)],
			languageOptions: {
				parser: parserTs,
				parserOptions: {
					ecmaFeatures: {
						modules: true,
					},
					ecmaVersion: 'latest',
					extraFileExtensions: componentExts.map(e => `.${e}`),
					sourceType: 'module',
					...(tsconfigPath
						? {
							projevt: tsconfigPath,
							tsconfigRootDir: process.cwd(),
						}
						: {}),
					...(parserOptions as any),
				},
			},
			name: 'petal:typescript:rules',
			rules: {
				...renameRules(
					pluginTs.configs['eslint-recommended'].overrides![0].rules!,
					'@typescript-eslint/',
					'ts/',
				),
				...renameRules(
					pluginTs.configs.strict.rules!,
					'@typescript-eslint/',
					'ts/',
				),

				'petal/generic-spacing': 'error',
				'petal/named-tuple-spacing': 'error',

				'no-dupe-class-members': 'off',
				'no-invalid-this': 'off',
				'no-loss-of-precision': 'off',
				'no-redeclare': 'off',
				'no-use-before-define': 'off',
				'no-useless-constructor': 'off',
				'ts/ban-ts-comment': [
					'error',
					{ 'ts-ignore': 'allow-with-description' },
				],
				'ts/ban-types': ['error', { types: { Function: false } }],
				'ts/consistent-type-definitions': ['error', 'interface'],
				'ts/consistent-type-imports': [
					'error',
					{ disallowTypeAnnotations: false, prefer: 'type-imports' },
				],
				'ts/no-dupe-class-members': 'error',
				'ts/no-dynamic-delete': 'off',
				'ts/no-explicit-any': 'off',
				'ts/no-extraneous-class': 'off',
				'ts/no-import-type-side-effects': 'error',
				'ts/no-invalid-this': 'error',
				'ts/no-invalid-void-type': 'off',
				'ts/no-loss-of-precision': 'error',
				'ts/no-non-null-assertion': 'off',
				'ts/no-redeclare': 'error',
				'ts/no-require-imports': 'error',
				'ts/no-unused-vars': 'off',
				'ts/no-use-before-define': [
					'error',
					{ classes: false, functions: false, variables: true },
				],
				'ts/no-useless-constructor': 'off',
				'ts/prefer-ts-expect-error': 'error',
				'ts/triple-slash-reference': 'off',
				'ts/unified-signatures': 'off',
				'ts/naming-convention': 'off',

				...(tsconfigPath ? typeAwareRules : {}),
				...overrides,
			},
		},
		{
			files: ['**/*.d.ts'],
			name: 'petal:typescript:dts-overrides',
			rules: {
				'eslint-comments/no-unlimited-disable': 'off',
				'import/no-duplicates': 'off',
				'no-restricted-syntax': 'off',
				'unused-imports/no-unused-vars': 'off',
			},
		},
		{
			files: ['**/*.{test,spec}.ts?(x)'],
			name: 'petal:typescript:tests-overrides',
			rules: {
				'no-unused-expressions': 'off',
			},
		},
		{
			files: ['**/*.js', '**/*.cjs'],
			name: 'petal:typescript:javascript-overrides',
			rules: {
				'ts/no-require-imports': 'off',
				'ts/no-var-requires': 'off',
			},
		},
	];
};
