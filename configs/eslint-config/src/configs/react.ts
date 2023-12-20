import { isPackageExists } from 'local-pkg';
import type {
	FlatConfigItem,
	OptionsFiles,
	OptionsHasTypeScript,
	OptionsOverrides,
} from '../types.js';
import { GLOB_JSX, GLOB_TSX } from '../globs.js';
import { ensurePackages, interopDefault } from '../utils.js';

const ReactRefreshAllowConstantExportPackages = ['vite'];

export async function react(options: OptionsHasTypeScript & OptionsOverrides & OptionsFiles = {}): Promise<FlatConfigItem[]> {
	const { files = [GLOB_JSX, GLOB_TSX], overrides = {}, typescript = true } = options;

	await ensurePackages([
		'eslint-plugin-react',
		'eslint-plugin-react-hooks',
		'eslint-plugin-react-refresh',
	]);

	const [
		pluginA11y,
		pluginReact,
		pluginReactHooks,
		pluginReactRefresh,
	] = await Promise.all([
		// @ts-expect-error missing types
		interopDefault(import('eslint-plugin-jsx-a11y')),
		interopDefault(import('eslint-plugin-react')),
		interopDefault(import('eslint-plugin-react-hooks')),
		interopDefault(import('eslint-plugin-react-refresh')),
	] as const);

	const isAllowConstantExport = ReactRefreshAllowConstantExportPackages.some(p => isPackageExists(p));

	return [
		{
			name: 'petal:react:setup',
			plugins: {
				a11y: pluginA11y,
				react: pluginReact,
				reactHooks: pluginReactHooks,
				reactRefresh: pluginReactRefresh,
			},
			settings: {
				react: {
					version: 'detect',
				},
			},
		},
		{
			files,
			languageOptions: {
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
			name: 'petal:react:rules',
			rules: {
				...(pluginA11y.configs.recommended.rules as any),

				// Enforce the list of dependencies for hooks is correct
				'react-hooks/exhaustive-deps': 2,
				// Enforce react rules of hooks
				'react-hooks/rules-of-hooks': 2,
				// react refresh
				'react-refresh/only-export-components': [
					'warn',
					{ allowConstantExport: isAllowConstantExport },
				],
				// Prevent missing displayName in a React component definition
				'react/display-name': 0,
				// Enforce boolean attributes notation in JSX
				'react/jsx-boolean-value': 2,
				// recommended rules react
				'react/jsx-key': 'error',
				'react/jsx-no-comment-textnodes': 'error',
				// Prevent duplicate props in JSX
				'react/jsx-no-duplicate-props': 0,
				'react/jsx-no-target-blank': 'error',
				// Disallow undeclared variables in JSX
				'react/jsx-no-undef': 0,
				// Enforce quote style for JSX attributes
				'react/jsx-quotes': 0,
				// Enforce propTypes declarations alphabetical sorting
				'react/jsx-sort-prop-types': 0,
				// Prevent React to be incorrectly marked as unused
				'react/jsx-uses-react': 2,
				// Prevent variables used in JSX to be incorrectly marked as unused
				'react/jsx-uses-vars': 2,
				'react/no-children-prop': 'error',
				// Prevent usage of dangerous JSX properties
				'react/no-danger': 0,
				'react/no-danger-with-children': 'error',
				'react/no-deprecated': 'error',
				// Prevent usage of setState in componentDidMount
				'react/no-did-mount-set-state': 0,
				// Prevent usage of setState in componentDidUpdate
				'react/no-did-update-set-state': 2,
				'react/no-direct-mutation-state': 'error',
				'react/no-find-dom-node': 'error',
				'react/no-is-mounted': 'error',
				// Prevent multiple component definition per file
				'react/no-multi-comp': [2, { ignoreStateless: true }],
				'react/no-render-return-value': 'error',

				'react/no-string-refs': 'error',

				'react/no-unescaped-entities': 'error',
				// Prevent usage of unknown DOM property
				'react/no-unknown-property': 2,
				'react/no-unsafe': 'off',
				// Prevent missing props validation in a React component definition
				'react/prop-types': 0,
				// Prevent missing React when using JSX
				'react/react-in-jsx-scope': 2,
				// Restrict file extensions that may be required
				'react/require-extension': 0,
				'react/require-render-return': 'error',
				// Prevent extra closing tags for components without children
				'react/self-closing-comp': 2,
				// Enforce component methods order
				'react/sort-comp': [
					2,
					{
						order: [
							'statics',
							'static-variables',
							'static-methods',
							'instance-variables',
							'constructor',
							'getChildContext',
							'componentDidMount',
							'shouldComponentUpdate',
							'getSnapshotBeforeUpdate',
							'componentDidUpdate',
							'componentWillUnmount',
							'componentDidCatch',
							'/^handle.+$/',
							'/^on.+$/',
							'everything-else',
							'/^render.+$/',
							'render',
						],
					},
				],
				// Enforce or disallow react string props to be wrapped in curly braces
				'style/jsx-curly-brace-presence': 2,
				// Enforce or disallow spaces inside of curly braces in JSX attributes
				'style/jsx-curly-spacing': 0,
				// Enforce props alphabetical sorting
				'style/jsx-sort-props': 0,
				// Prevent missing parentheses around multilines JSX
				'style/jsx-wrap-multilines': 2,

				...typescript
					? {
							'react/jsx-no-undef': 'off',
							'react/prop-type': 'off',
						}
					: {},
				...overrides,
			},
		},
	];
}
