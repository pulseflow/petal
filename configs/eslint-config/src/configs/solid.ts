import globals from 'globals';
import type { FlatConfigItem, OptionsFiles, OptionsHasTypeScript, OptionsOverrides } from '../types.js';
import { GLOB_JSX, GLOB_TSX } from '../globs.js';
import { ensurePackages, interopDefault } from '../utils.js';

export async function solid(options: OptionsHasTypeScript & OptionsOverrides & OptionsFiles = {}): Promise<FlatConfigItem[]> {
	const { files = [GLOB_JSX, GLOB_TSX], overrides = {} } = options;

	await ensurePackages([
		'eslint-plugin-solid',
	]);

	const [
		pluginSolid,
	] = await Promise.all([
		// @ts-expect-error missing types
		interopDefault(import('eslint-plugin-solid')),
	] as const);

	return [
		{
			name: 'petal:solid:setup',
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
				parser: options.typescript
					? await interopDefault(import('@typescript-eslint/parser')) as any
					: null,
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
				},
				sourceType: 'module',
			},
			name: 'petal:solid:rules',
			rules: {
				'node/prefer-global/process': 'off',

				'solid/components-return-once': 1,
				'solid/event-handlers': 1,

				'solid/imports': 1,
				'solid/jsx-no-duplicate-props': 2,
				'solid/jsx-no-script-url': 2,
				'solid/jsx-no-undef': [2, { typescriptEnabled: true }],
				'solid/jsx-uses-vars': 2,
				'solid/no-array-handlers': 0,
				'solid/no-destructure': 2,
				'solid/no-innerhtml': 2,
				'solid/no-proxy-apis': 0,
				'solid/no-react-deps': 1,
				'solid/no-react-specific-props': 1,
				'solid/no-unknown-namespaces': 0,
				'solid/prefer-classlist': 0,
				'solid/prefer-for': 2,
				'solid/prefer-show': 0,
				'solid/reactivity': 1,
				'solid/self-closing-comp': 1,
				'solid/style-prop': 1,

				...overrides,
			},
		},
	];
}
