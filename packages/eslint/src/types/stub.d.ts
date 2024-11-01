// https://github.com/facebook/react/issues/30119
declare module 'eslint-plugin-react-hooks' {
	import type { ESLint, Linter } from 'eslint';

	const eslintPluginReactHooks: ESLint.Plugin & {
		configs: {
			recommended: Linter.Config;
		};
	};

	export default eslintPluginReactHooks;
}

// fixed in
declare module '@eslint-community/eslint-plugin-eslint-comments' {
	import type { ESLint, Linter } from 'eslint';

	const eslintPluginESLintComments: ESLint.Plugin & {
		configs: {
			recommended: Linter.LegacyConfig;
		};
	};

	export default eslintPluginESLintComments;
}
