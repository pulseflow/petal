// https://github.com/facebook/react/issues/28313
declare module 'eslint-plugin-react-hooks' {
	import type { ESLint, Linter } from 'eslint';

	const eslintPluginReactHooks: ESLint.Plugin & {
		configs: {
			recommended: Linter.Config;
		};
	};

	export = eslintPluginReactHooks;
	export default { eslintPluginReactHooks };
};

declare module 'eslint-plugin-vue' {
	import type { ESLint, Linter } from 'eslint';

	const eslintPluginVue: ESLint.Plugin & {
		configs: {
			'base': Linter.Config;
			'essential': Linter.Config;
			'strongly-recommended': Linter.Config;
			'recommended': Linter.Config;
			'vue3-essential': Linter.Config;
			'vue3-strongly-recommended': Linter.Config;
			'vue3-recommended': Linter.Config;
		};
		processors: {
			'.vue': Linter.Processor;
		};
	};

	export = eslintPluginVue;
	export default { eslintPluginVue };
};

declare module 'eslint-plugin-markdown' {
	import type { ESLint, Linter } from 'eslint';

	const eslintPluginMarkdown: ESLint.Plugin & {
		configs: {
			'recommended': Linter.Config;
			'recommended-legacy': Linter.LegacyConfig;
		};
		processors: {
			markdown: Linter.Processor;
		};
	};

	export = eslintPluginMarkdown;
	export default { eslintPluginMarkdown };
};

declare module 'eslint-plugin-unused-imports' {
	import type { ESLint } from 'eslint';

	const eslintPluginUnusedImports: ESLint.Plugin;

	export = eslintPluginUnusedImports;
	export default { eslintPluginUnusedImports };
};

declare module '@eslint-community/eslint-plugin-eslint-comments' {
	import type { ESLint, Linter } from 'eslint';

	const eslintPluginESLintComments: ESLint.Plugin & {
		configs: {
			recommended: Linter.LegacyConfig;
		};
	};

	export = eslintPluginESLintComments;
	export default { eslintPluginESLintComments };
};
