import globals from 'globals';
import type { OptionsFiles, OptionsHasTypeScript, OptionsOverrides, OptionsTypeScriptWithTypes, TypedFlatConfigItem } from '../types.js';
import { GLOB_JSX, GLOB_TSX } from '../globs.js';
import { ensurePackages, interopDefault, toArray } from '../utils.js';

export async function solid(options: OptionsHasTypeScript & OptionsOverrides & OptionsFiles & OptionsTypeScriptWithTypes = {}): Promise<TypedFlatConfigItem[]> {
	const { files = [GLOB_JSX, GLOB_TSX], overrides = {}, typescript = true } = options;

	await ensurePackages([
		'eslint-plugin-solid',
	]);

	const tsconfigPath = options?.tsconfigPath
		? toArray(options.tsconfigPath)
		: undefined;
	const isTypeAware = !!tsconfigPath;

	const [
		pluginSolid,
		parserTs,
	] = await Promise.all([
		interopDefault(import('eslint-plugin-solid')),
		interopDefault(import('@typescript-eslint/parser')),
	] as const);

	return [
		{
			name: 'petal/solid/setup',
			plugins: {
				solid: pluginSolid,
			},
		},
		{
			files,
			languageOptions: {
				globals: {
					...globals.browser,
					...globals.es2021,
				},
				parser: parserTs,
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
					...isTypeAware ? { project: tsconfigPath } : {},
				},
				sourceType: 'module',
			},
			name: 'petal/solid/rules',
			rules: {
				'solid/components-return-once': 'warn',
				'solid/event-handlers': ['error', {
					ignoreCase: false,
					warnOnSpread: false,
				}],
				'solid/imports': 'error',
				'solid/jsx-no-duplicate-props': 'error',
				'solid/jsx-no-script-url': 'error',
				'solid/jsx-no-undef': 'error',
				'solid/jsx-uses-vars': 'error',
				'solid/no-destructure': 'error',
				'solid/no-innerhtml': ['error', { allowStatic: true }],
				'solid/no-react-deps': 'error',
				'solid/no-react-specific-props': 'error',
				'solid/no-unknown-namespaces': 'error',
				'solid/prefer-for': 'error',
				'solid/reactivity': 'warn',
				'solid/self-closing-comp': 'error',
				'solid/style-prop': ['error', { styleProps: ['style', 'css'] }],
				...typescript
					? {
							'solid/jsx-no-undef': ['error', { typescriptEnabled: true }],
							'solid/no-unknown-namespaces': 'off',
						}
					: {},

				...overrides,
			},
		},
	];
}
