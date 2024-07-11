// https://github.com/facebook/react/issues/28313
declare module 'eslint-plugin-react-hooks' {
	import type { ESLint, Linter } from 'eslint';

	const eslintPluginReactHooks: ESLint.Plugin & {
		configs: {
			recommended: Linter.FlatConfig;
		};
	};

	export = eslintPluginReactHooks;
	export default { eslintPluginReactHooks };
};

declare module 'eslint-plugin-vue' {
	import type { ESLint, Linter } from 'eslint';

	const eslintPluginVue: ESLint.Plugin & {
		configs: {
			'base': Linter.FlatConfig;
			'essential': Linter.FlatConfig;
			'strongly-recommended': Linter.FlatConfig;
			'recommended': Linter.FlatConfig;
			'vue3-essential': Linter.FlatConfig;
			'vue3-strongly-recommended': Linter.FlatConfig;
			'vue3-recommended': Linter.FlatConfig;
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
			'recommended': Linter.FlatConfig;
			'recommended-legacy': Linter.Config;
		};
		processors: {
			markdown: Linter.Processor;
		};
	};

	export = eslintPluginMarkdown;
	export default { eslintPluginMarkdown };
};

// merged, awaiting next release
declare module 'eslint-plugin-unicorn' {
	import type { ESLint, Linter } from 'eslint';

	const eslintPluginUnicorn: ESLint.Plugin & {
		configs: {
			'recommended': Linter.Config;
			'all': Linter.Config;
			'flat/all': Linter.FlatConfig;
			'flat/recommended': Linter.FlatConfig;
		};
	};

	export = eslintPluginUnicorn;
	export default { eslintPluginUnicorn };
};

// https://github.com/azat-io/eslint-plugin-perfectionist/issues/154
declare module 'eslint-plugin-perfectionist' {
	import type { ESLint, Linter } from 'eslint';

	const eslintPluginPerfectionist: ESLint.Plugin & {
		configs: {
			'recommended-alphabetical': Linter.Config;
			'recommended-natural': Linter.Config;
			'recommended-line-length': Linter.Config;
		};
	};

	export = eslintPluginPerfectionist;
	export default { eslintPluginPerfectionist };
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
			recommended: Linter.Config;
		};
	};

	export = eslintPluginESLintComments;
	export default { eslintPluginESLintComments };
};
