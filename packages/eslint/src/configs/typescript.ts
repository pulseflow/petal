import type { OptionsTypeScript, TypedFlatConfigItem } from '../types/index.ts';
import process from 'node:process';
import { GLOB_ASTRO_TS, GLOB_MARKDOWN, GLOB_TS, GLOB_TSX } from '../globs.ts';
import { interopDefault, renameRules } from '../utils.ts';

export async function typescript(options: OptionsTypeScript = {}): Promise<TypedFlatConfigItem[]> {
	const componentExts = options.componentExts ?? [];
	const files = options.files ?? [GLOB_TS, GLOB_TSX, ...componentExts.map(f => `**/*.${f}`)];
	const filesTypeAware = options.filesTypeAware ?? [GLOB_TS, GLOB_TSX];
	const ignoresTypeAware = options.ignoresTypeAware ?? [`${GLOB_MARKDOWN}/**`, GLOB_ASTRO_TS];
	const tsconfigPath = options.tsconfigPath ? options.tsconfigPath : undefined;

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
					warnOnUnsupportedTypeScriptVersion: false,
					...typeAware
						? {
								projectService: {
									allowDefaultProject: ['./*.js'],
									defaultProject: tsconfigPath,
								},
								tsconfigRootDir: process.cwd(),
							}
						: {},
					...options.parserOptions ?? {},
				} as import('@typescript-eslint/parser').ParserOptions,
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
		...tsconfigPath
			? [makeParser(false, files), makeParser(true, filesTypeAware, ignoresTypeAware)]
			: [makeParser(false, files)],
		{
			files,
			name: 'petal/typescript/rules',
			rules: {
				...renameRules(pluginTs.configs['eslint-recommended'].overrides![0].rules!, { '@typescript-eslint': 'ts' }),
				...renameRules(pluginTs.configs.strict.rules!, { '@typescript-eslint': 'ts' }),

				'class-methods-use-this': 'off',
				'no-dupe-class-members': 'off',
				'no-redeclare': 'off',
				'no-use-before-define': 'off',
				'no-useless-constructor': 'off',
				'ts/adjacent-overload-signatures': 'error',

				'ts/array-type': ['error', { default: 'array-simple', readonly: 'array-simple' }],
				'ts/ban-ts-comment': ['error', {
					'minimumDescriptionLength': 3,
					'ts-check': false,
					'ts-expect-error': { descriptionFormat: '^: .+$' },
					'ts-ignore': false,
					'ts-nocheck': false,
				}],
				'ts/no-unnecessary-parameter-property-assignment': 'error',
				'ts/ban-tslint-comment': 'error',
				'ts/class-literal-property-style': ['error', 'fields'],
				'ts/class-methods-use-this': ['error', { ignoreClassesThatImplementAnInterface: true, ignoreOverrideMethods: false }],
				'ts/consistent-generic-constructors': ['error', 'type-annotation'],
				'ts/consistent-indexed-object-style': ['error', 'record'],
				'ts/consistent-return': 'off', // use `noImplicitReturns` instead.
				'ts/consistent-type-assertions': ['error', { assertionStyle: 'as', objectLiteralTypeAssertions: 'allow' }],
				'ts/consistent-type-definitions': ['error', 'interface'],
				'ts/consistent-type-imports': ['error', {
					disallowTypeAnnotations: false,
					fixStyle: 'separate-type-imports',
					prefer: 'type-imports',
				}],
				'ts/default-param-last': 'off',
				'ts/init-declarations': 'off',
				'ts/method-signature-style': ['error', 'property'], // https://www.totaltypescript.com/method-shorthand-syntax-considered-harmful
				'ts/no-dupe-class-members': 'error',
				'ts/no-dynamic-delete': 'off',
				'ts/no-empty-object-type': ['error', { allowInterfaces: 'always' }],
				'ts/no-explicit-any': 'off',
				'ts/no-extraneous-class': 'off',
				'ts/no-import-type-side-effects': 'error',
				'ts/no-invalid-void-type': 'off',
				'ts/no-non-null-assertion': 'off',
				'ts/no-redeclare': ['error', { builtinGlobals: false }],
				'ts/no-require-imports': 'error',
				'ts/no-unnecessary-type-constraint': 'error',
				'ts/no-unused-expressions': ['error', {
					allowShortCircuit: true,
					allowTaggedTemplates: true,
					allowTernary: true,
				}],
				'ts/no-unused-vars': 'off',
				'ts/no-useless-empty-export': 'error',
				'ts/no-use-before-define': ['error', { classes: false, functions: false, variables: true }],
				'ts/no-useless-constructor': 'off',
				'ts/no-wrapper-object-types': 'error',
				'ts/triple-slash-reference': 'off',
				'ts/unified-signatures': 'off',

				...((options.type ?? 'app') === 'lib'
					? {
							'ts/explicit-function-return-type': ['error', {
								allowConciseArrowFunctionExpressionsStartingWithVoid: false,
								allowDirectConstAssertionInArrowFunctions: true,
								allowedNames: [],
								allowExpressions: true,
								allowFunctionsWithoutTypeParameters: false,
								allowHigherOrderFunctions: true,
								allowIIFEs: true,
								allowTypedFunctionExpressions: true,
							}],
							'ts/explicit-member-accessibility': ['error', {
								accessibility: 'explicit',
								ignoredMethodNames: [],
							}],
							'ts/explicit-module-boundary-types': ['error', {
								allowArgumentsExplicitlyTypedAsAny: false,
								allowDirectConstAssertionInArrowFunctions: true,
								allowedNames: [],
								allowHigherOrderFunctions: true,
								allowTypedFunctionExpressions: true,
							}],
						}
					: {}
				),
				...options.overrides ?? {},
			},
		},
		...tsconfigPath
			? [{
				files: filesTypeAware,
				ignores: ignoresTypeAware,
				name: 'petal/typescript/rules-type-aware',
				rules: {
					'dot-notation': 'off',
					'no-implied-eval': 'off',
					'ts/await-thenable': 'error',
					'ts/consistent-type-exports': ['error', { fixMixedExportsWithInlineTypeSpecifier: true }],
					'ts/dot-notation': ['error', { allowIndexSignaturePropertyAccess: false, allowKeywords: true, allowPrivateClassPropertyAccess: false, allowProtectedClassPropertyAccess: false }],
					'ts/no-floating-promises': 'error',
					'ts/no-for-in-array': 'error',
					'ts/no-implied-eval': 'error',
					'ts/no-misused-promises': 'error',
					'ts/no-unnecessary-type-assertion': 'error',
					'ts/no-unsafe-argument': 'error',
					'ts/no-unsafe-assignment': 'error',
					'ts/no-unsafe-call': 'error',
					'ts/no-unnecessary-type-parameters': 'error',
					'ts/no-unsafe-member-access': 'error',
					'ts/no-unnecessary-type-arguments': 'error',
					'ts/no-unnecessary-template-expression': 'error',
					'ts/no-unnecessary-qualifier': 'error',
					'ts/no-unnecessary-condition': ['error', { allowConstantLoopConditions: true }],
					'ts/no-unsafe-return': 'error',
					'ts/no-unnecessary-boolean-literal-compare': 'error',
					'ts/related-getter-setter-pairs': 'error',
					'ts/prefer-readonly': 'off',
					'ts/promise-function-async': 'error',
					'ts/restrict-plus-operands': 'error',
					'ts/restrict-template-expressions': ['error', { allowNever: true, allowNullish: true }],
					'ts/return-await': ['error', 'in-try-catch'],
					'ts/strict-boolean-expressions': ['error', { allowNullableBoolean: true, allowNullableObject: true }],
					'ts/switch-exhaustiveness-check': 'error',
					'ts/unbound-method': 'error',
					...options.overridesTypeAware ?? {},
				},
			} satisfies TypedFlatConfigItem]
			: [],
	];
}
