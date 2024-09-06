import process from 'node:process';
import type { Linter } from 'eslint';
import { GLOB_ASTRO_TS, GLOB_MARKDOWN, GLOB_TS, GLOB_TSX } from '../globs';
import { interopDefault, renameRules } from '../utils';
import type { OptionsTypeScript, TypedFlatConfigItem } from '../types';

export async function typescript(options: OptionsTypeScript = {}): Promise<TypedFlatConfigItem[]> {
	const { componentExts = [], overrides = {}, overridesTypeAware = {}, parserOptions = {}, type = 'app' } = options;
	const files = options.files ?? [GLOB_TS, GLOB_TSX, ...componentExts.map(f => `**/*.${f}`)];
	const filesTypeAware = options.filesTypeAware ?? [GLOB_TS, GLOB_TSX];
	const ignoresTypeAware = options.ignoresTypeAware ?? [`${GLOB_MARKDOWN}/**`, GLOB_ASTRO_TS];
	const tsconfigPath = options?.tsconfigPath ? options.tsconfigPath : undefined;
	const isTypeAware = !!tsconfigPath;

	const typeAwareRules: TypedFlatConfigItem['rules'] = {
		'dot-notation': 'off',
		'no-implied-eval': 'off',
		'ts/await-thenable': 'error',
		'ts/dot-notation': ['error', { allowKeywords: true }],
		'ts/no-floating-promises': 'error',
		'ts/no-for-in-array': 'error',
		'ts/no-implied-eval': 'error',
		'ts/no-misused-promises': 'error',
		'ts/no-unnecessary-type-assertion': 'error',
		'ts/no-unsafe-argument': 'error',
		'ts/no-unsafe-assignment': 'error',
		'ts/no-unsafe-call': 'error',
		'ts/no-unsafe-member-access': 'error',
		'ts/no-unsafe-return': 'error',
		'ts/promise-function-async': 'error',
		'ts/restrict-plus-operands': 'error',
		'ts/restrict-template-expressions': 'error',
		'ts/return-await': ['error', 'in-try-catch'],
		'ts/strict-boolean-expressions': ['error', { allowNullableBoolean: true, allowNullableObject: true }],
		'ts/switch-exhaustiveness-check': 'error',
		'ts/unbound-method': 'error',
	};

	const [
		pluginPetal,
		pluginTs,
		parserTs,
	] = await Promise.all([
		interopDefault(import('eslint-plugin-petal')),
		interopDefault(import('@typescript-eslint/eslint-plugin')),
		interopDefault(import('@typescript-eslint/parser')),
	] as const);

	const makeParser = (typeAware: boolean, files: string[], ignores?: string[]): TypedFlatConfigItem =>
		({
			files,
			...ignores ? { ignores } : {},
			languageOptions: {
				parser: parserTs,
				parserOptions: {
					extraFileExtensions: componentExts.map(e => `.${e}`),
					sourceType: 'module',
					...typeAware
						? {
								projectService: {
									allowDefaultProject: ['./*.js'],
									defaultProject: tsconfigPath,
								},
								tsconfigRootDir: process.cwd(),
							}
						: {},
					...parserOptions as Linter.ParserOptions,
				},
			},
			name: `petal/typescript/${typeAware ? 'type-aware-parser' : 'parser'}`,
		});

	return [
		{
			name: 'petal/typescript/setup',
			plugins: {
				petal: pluginPetal,
				ts: pluginTs,
			},
		},
		...isTypeAware
			? [
					makeParser(false, files),
					makeParser(true, filesTypeAware, ignoresTypeAware),
				]
			: [
					makeParser(false, files),
				],
		{
			files,
			name: 'petal/typescript/rules',
			rules: {
				...renameRules(pluginTs.configs['eslint-recommended'].overrides![0].rules!, { '@typescript-eslint': 'ts' }),
				...renameRules(pluginTs.configs.strict.rules!, { '@typescript-eslint': 'ts' }),
				'no-dupe-class-members': 'off',
				'no-redeclare': 'off',
				'no-use-before-define': 'off',
				'no-useless-constructor': 'off',
				'ts/ban-ts-comment': ['error', { 'ts-expect-error': 'allow-with-description' }],
				'ts/consistent-indexed-object-style': ['error', 'record'],
				'ts/consistent-type-definitions': ['error', 'interface'],
				// 'ts/consistent-type-exports': ['error', { fixMixedExportsWithInlineTypeSpecifier: true }],
				'ts/consistent-type-imports': ['error', {
					disallowTypeAnnotations: false,
					prefer: 'type-imports',
				}],
				'ts/method-signature-style': ['error', 'property'], // https://www.totaltypescript.com/method-shorthand-syntax-considered-harmful
				'ts/no-dupe-class-members': 'error',
				'ts/no-dynamic-delete': 'off',
				'ts/no-empty-object-type': ['error', { allowInterfaces: 'always' }],
				'ts/no-explicit-any': 'off',
				'ts/no-extraneous-class': 'off',
				'ts/no-import-type-side-effects': 'error',
				'ts/no-invalid-void-type': 'off',
				'ts/no-non-null-assertion': 'off',
				'ts/no-redeclare': 'error',
				'ts/no-require-imports': 'error',
				'ts/no-unused-vars': 'off',
				'ts/no-use-before-define': ['error', { classes: false, functions: false, variables: true }],
				'ts/no-useless-constructor': 'off',
				'ts/no-wrapper-object-types': 'error',
				'ts/triple-slash-reference': 'off',
				'ts/unified-signatures': 'off',

				...(type === 'lib'
					? {
							'ts/explicit-function-return-type': ['error', {
								allowExpressions: true,
								allowHigherOrderFunctions: true,
								allowIIFEs: true,
							}],
							// 'ts/explicit-member-accessibility': 'error',
							// 'ts/explicit-module-boundary-types': 'error',
						}
					: {}
				),
				...overrides,
			},
		},
		...isTypeAware
			? [{
					files: filesTypeAware,
					ignores: ignoresTypeAware,
					name: 'petal/typescript/rules-type-aware',
					rules: {
						...typeAwareRules,
						...overridesTypeAware,
					},
				}]
			: [],
	];
}
