import process from 'node:process';
import type {
	FlatConfigItem,
	OptionsComponentExts,
	OptionsFiles,
	OptionsOverrides,
	OptionsTypeScriptParserOptions,
	OptionsTypeScriptWithTypes,
} from '../types.js';
import { GLOB_SRC, GLOB_TS, GLOB_TSX } from '../globs.js';
import { pluginPetal } from '../plugins.js';
import { interopDefault, renameRules, toArray } from '../utils.js';

export async function typescript(options: OptionsComponentExts &
	OptionsOverrides &
	OptionsTypeScriptWithTypes &
	OptionsTypeScriptParserOptions &
	OptionsFiles = {}): Promise<FlatConfigItem[]> {
	const {
		componentExts = [],
		overrides = {},
		parserOptions = {},
	} = options;

	const files = options.files ?? [
		GLOB_SRC,
		...componentExts.map(f => `**/*.${f}`),
	];

	const filesTypeAware = options.filesTypeAware ?? [GLOB_TS, GLOB_TSX];
	const tsconfigPath = options?.tsconfigPath
		? toArray(options.tsconfigPath)
		: undefined;
	const isTypeAware = !!tsconfigPath;

	const typeAwareRules: FlatConfigItem['rules'] = {
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

	const [
		pluginTs,
		parserTs,
	] = await Promise.all([
		interopDefault(import('@typescript-eslint/eslint-plugin')),
		interopDefault(import('@typescript-eslint/parser')),
	] as const);

	function makeParser(typeAware: boolean, files: string[], ignores?: string[]): FlatConfigItem {
		return {
			files,
			...ignores ? { ignores } : {},
			languageOptions: {
				parser: parserTs,
				parserOptions: {
					ecmaFeatures: {
						modules: true,
					},
					ecmaVersion: 'latest',
					extraFileExtensions: componentExts.map(e => `.${e}`),
					sourceType: 'module',
					...(typeAware
						? {
								project: tsconfigPath,
								tsconfigRootDir: process.cwd(),
							}
						: {}),
					...(parserOptions as any),
				},
			},
			name: `petal:typescript:${typeAware ? 'type-aware-parser' : 'parser'}`,
		};
	};

	return [
		{
			name: 'petal:typescript:setup',
			plugins: {
				petal: pluginPetal,
				ts: pluginTs as any,
			},
		},
		...isTypeAware
			? [
					makeParser(true, filesTypeAware),
					makeParser(false, files, filesTypeAware),
				]
			: [makeParser(false, files)],
		{
			files,
			name: 'petal:typescript:rules',
			rules: {
				...renameRules(
					pluginTs.configs['eslint-recommended'].overrides![0].rules!,
					{ '@typescript-eslint': 'ts' },
				),
				...renameRules(
					pluginTs.configs.strict.rules!,
					{ '@typescript-eslint': 'ts' },
				),
				'no-dupe-class-members': 'off',
				'no-loss-of-precision': 'off',
				'no-redeclare': 'off',
				'no-use-before-define': 'off',
				'no-useless-constructor': 'off',
				'style/implicit-arrow-linebreak': 'off',
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
				'ts/method-signature-style': ['error', 'property'], // https://www.totaltypescript.com/method-shorthand-syntax-considered-harmful
				'ts/naming-convention': 'off',
				'ts/no-dupe-class-members': 'error',
				'ts/no-dynamic-delete': 'off',
				'ts/no-explicit-any': 'off',
				'ts/no-extraneous-class': 'off',
				'ts/no-import-type-side-effects': 'error',
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
				...overrides,
			},
		},
		{
			files: filesTypeAware,
			name: 'petal:typescript:rules-type-aware',
			rules: {
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
}
