import type { OptionsReact, TypedFlatConfigItem } from '../types/index.ts';
import { isPackageExists } from 'local-pkg';
import { GLOB_ASTRO_TS, GLOB_MARKDOWN, GLOB_SRC, GLOB_TS, GLOB_TSX } from '../globs.ts';
import { ensurePackages, interopDefault } from '../utils.ts';

const ReactRefreshAllowConstantExportPackages = ['vite'];
const RouterPackages = ['node', 'react', 'serve', 'dev'];
const pkgSort = (i: string): boolean => isPackageExists(i);
const NextJsPackages = ['next'];

export async function react(options: OptionsReact = {}): Promise<TypedFlatConfigItem[]> {
	const { accessibility = false, files = [GLOB_SRC], overrides = {}, filesTypeAware = [GLOB_TS, GLOB_TSX], ignoresTypeAware = [`${GLOB_MARKDOWN}/**`, GLOB_ASTRO_TS], tsconfigPath } = options;
	await ensurePackages(['@eslint-react/eslint-plugin', 'eslint-plugin-react-hooks']);

	if (accessibility)
		await ensurePackages(['eslint-plugin-jsx-a11y']);

	const [pluginReact, pluginReactHooks, pluginPetal] = await Promise.all([
		interopDefault(import('@eslint-react/eslint-plugin')),
		interopDefault(import('eslint-plugin-react-hooks')),
		interopDefault(import('eslint-plugin-petal')),
	] as const);

	const isAllowConstantExport = ReactRefreshAllowConstantExportPackages.some(pkgSort);
	const isUsingRemix = RouterPackages.map(i => `@remix-run/${i}`).some(pkgSort);
	const isUsingNext = NextJsPackages.some(pkgSort);
	const isUsingReactRouter = RouterPackages.map(i => `@react-router/${i}`).some(pkgSort);
	const plugins = pluginReact.configs.all.plugins;
	const isTypeAware = !!tsconfigPath;
	const typeAwareRules: TypedFlatConfigItem['rules'] = {
		'react/no-leaked-conditional-rendering': 'warn',
	};

	return [
		{
			name: 'petal/react/setup',
			plugins: {
				'petal': pluginPetal,
				'react': plugins['@eslint-react'],
				'react-dom': plugins['@eslint-react/dom'],
				'react-hooks': pluginReactHooks,
				'react-hooks-extra': plugins['@eslint-react/hooks-extra'],
				'react-naming-convention': plugins['@eslint-react/naming-convention'],
				'react-web-api': plugins['@eslint-react/web-api'],

				...accessibility ? { 'jsx-a11y': await interopDefault(import('eslint-plugin-jsx-a11y')) } : {},
			},
		},
		{
			files,
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
				},
				sourceType: 'module',
			},
			name: 'petal/react/rules',
			rules: {
				// react refresh petal
				// 'petal/only-export-components': [
				// 	'warn',
				// 	{
				// 		allowConstantExport: isAllowConstantExport,
				// 		allowExportNames: [
				// 			...isUsingNext
				// 				? [
				// 						'dynamic',
				// 						'dynamicParams',
				// 						'revalidate',
				// 						'fetchCache',
				// 						'runtime',
				// 						'preferredRegion',
				// 						'maxDuration',
				// 						'config',
				// 						'generateStaticParams',
				// 						'metadata',
				// 						'generateMetadata',
				// 						'viewport',
				// 						'generateViewport',
				// 					]
				// 				: [],
				// 			...isUsingRemix || isUsingReactRouter
				// 				? [
				// 						'meta',
				// 						'links',
				// 						'headers',
				// 						'loader',
				// 						'action',
				// 					]
				// 				: [],
				// 		],
				// 	},
				// ],

				// recommended rules from @eslint-react/dom
				'react-dom/no-children-in-void-dom-elements': 'warn',
				'react-dom/no-dangerously-set-innerhtml': 'warn',
				'react-dom/no-dangerously-set-innerhtml-with-children': 'error',
				'react-dom/no-find-dom-node': 'error',
				'react-dom/no-missing-button-type': 'warn',
				'react-dom/no-missing-iframe-sandbox': 'warn',
				'react-dom/no-namespace': 'error',
				'react-dom/no-render-return-value': 'error',
				'react-dom/no-script-url': 'warn',
				'react-dom/no-unsafe-iframe-sandbox': 'warn',
				'react-dom/no-unsafe-target-blank': 'warn',

				// recommended rules react-hooks
				'react-hooks/exhaustive-deps': 'warn',
				'react-hooks/rules-of-hooks': 'error',

				// recommended rules from @eslint-react/web-api
				'react-web-api/no-leaked-event-listener': 'warn',
				'react-web-api/no-leaked-interval': 'warn',
				'react-web-api/no-leaked-resize-observer': 'warn',
				'react-web-api/no-leaked-timeout': 'warn',

				// recommended rules from @eslint-react
				'react/ensure-forward-ref-using-ref': 'warn',
				'react/jsx-no-duplicate-props': 'warn',
				'react/jsx-uses-vars': 'warn',
				'react/no-access-state-in-setstate': 'error',
				'react/no-array-index-key': 'warn',
				'react/no-children-count': 'warn',
				'react/no-children-for-each': 'warn',
				'react/no-children-map': 'warn',
				'react/no-children-only': 'warn',
				'react/no-children-to-array': 'warn',
				'react/no-context-provider': 'warn',
				'react/no-default-props': 'error',
				'react/no-clone-element': 'warn',
				'react/no-comment-textnodes': 'warn',
				'react/no-component-will-mount': 'error',
				'react/no-component-will-receive-props': 'error',
				'react/no-component-will-update': 'error',
				'react/no-create-ref': 'error',
				'react/no-direct-mutation-state': 'error',
				'react/no-implicit-key': 'warn',
				'react/no-forward-ref': 'warn',
				'react/no-duplicate-key': 'error',
				'react/no-missing-key': 'error',
				'react/no-nested-components': 'error',
				'react/no-prop-types': 'error',
				'react/no-redundant-should-component-update': 'error',
				'react/no-set-state-in-component-did-mount': 'warn',
				'react/no-set-state-in-component-did-update': 'warn',
				'react/no-set-state-in-component-will-update': 'warn',
				'react/no-string-refs': 'error',
				'react/no-unsafe-component-will-mount': 'warn',
				'react/no-unsafe-component-will-receive-props': 'warn',
				'react/no-unsafe-component-will-update': 'warn',
				'react/no-unstable-context-value': 'warn',
				'react/no-unstable-default-props': 'warn',
				'react/no-unused-class-component-members': 'warn',
				'react/no-unused-state': 'warn',
				'react/prefer-destructuring-assignment': 'warn',
				'react/prefer-shorthand-boolean': 'warn',
				'react/prefer-shorthand-fragment': 'warn',

				...accessibility ? (await interopDefault(import('eslint-plugin-jsx-a11y'))).flatConfigs.recommended.rules : {},

				...overrides,
			},
		},
		...isTypeAware
			? [{
				files: filesTypeAware,
				ignores: ignoresTypeAware,
				name: 'petal/react/type-aware-rules',
				rules: { ...typeAwareRules },
			} satisfies TypedFlatConfigItem]
			: [],
	];
}
