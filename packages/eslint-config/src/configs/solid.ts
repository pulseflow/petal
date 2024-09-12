import type { OptionsSolid, TypedFlatConfigItem } from '../types';
import globals from 'globals';
import { GLOB_JSX, GLOB_TSX } from '../globs';
import { ensurePackages, interopDefault, toArray } from '../utils';

export async function solid(options: OptionsSolid = {}): Promise<TypedFlatConfigItem[]> {
	const { accessibility = false, files = [GLOB_JSX, GLOB_TSX], overrides = {}, typescript = true } = options;
	await ensurePackages(['eslint-plugin-solid']);
	const tsconfigPath = options?.tsconfigPath ? toArray(options.tsconfigPath) : undefined;
	const isTypeAware = !!tsconfigPath;

	if (accessibility)
		await ensurePackages(['eslint-plugin-jsx-a11y']);

	const [pluginSolid, parserTs] = await Promise.all([
		interopDefault(import('eslint-plugin-solid')),
		interopDefault(import('@typescript-eslint/parser')),
	] as const);

	return [
		{
			name: 'petal/solid/setup',
			plugins: {
				solid: pluginSolid,

				...accessibility ? { 'jsx-a11y': await interopDefault(import('eslint-plugin-jsx-a11y')) } : {},
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
				'solid/event-handlers': ['error', { ignoreCase: false, warnOnSpread: false }],
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

				...accessibility ? (await interopDefault(import('eslint-plugin-jsx-a11y'))).flatConfigs.recommended.rules : {},

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
