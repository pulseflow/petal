import { mergeProcessors } from 'eslint-merge-processors';
import type {
	OptionsFiles,
	OptionsHasTypeScript,
	OptionsOverrides,
	OptionsStylistic,
	OptionsVue,
	TypedFlatConfigItem,
} from '../types';
import { GLOB_VUE } from '../globs';
import { ensurePackages, interopDefault } from '../utils';

export async function vue(options: OptionsHasTypeScript & OptionsOverrides & OptionsStylistic & OptionsFiles & OptionsVue = {}): Promise<TypedFlatConfigItem[]> {
	const { accessibility = false, files = [GLOB_VUE], overrides = {}, stylistic = true, vueVersion = 3 } = options;
	const { indent = 'tab' } = typeof stylistic === 'boolean' ? {} : stylistic;

	const sfcBlocks = options.sfcBlocks === true
		? {}
		: options.sfcBlocks ?? {};

	await ensurePackages([
		'eslint-plugin-vue',
		'vue-eslint-parser',
	]);

	if (sfcBlocks)
		ensurePackages(['eslint-processor-vue-blocks']);

	if (accessibility)
		ensurePackages(['eslint-plugin-vuejs-accessibility']);

	const [
		pluginVue,
		parserVue,
	] = await Promise.all([
		// @ts-expect-error missing types
		interopDefault(import('eslint-plugin-vue')),
		interopDefault(import('vue-eslint-parser')),
	] as const);

	return [
		{
			languageOptions: {
				globals: {
					computed: 'readonly',
					defineEmits: 'readonly',
					defineExpose: 'readonly',
					defineProps: 'readonly',
					onMounted: 'readonly',
					onUnmounted: 'readonly',
					reactive: 'readonly',
					ref: 'readonly',
					shallowReactive: 'readonly',
					shallowRef: 'readonly',
					toRef: 'readonly',
					toRefs: 'readonly',
					watch: 'readonly',
					watchEffect: 'readonly',
				},
			},
			name: 'petal/vue/setup',
			plugins: {
				vue: pluginVue,

				...accessibility ? { 'vue-a11y': await interopDefault(import('eslint-plugin-vuejs-accessibility')) } : {},
			},
		},
		{
			files,
			languageOptions: {
				parser: parserVue,
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
					extraFileExtensions: ['.vue'],
					parser: options.typescript
						? await interopDefault(import('@typescript-eslint/parser')) as any
						: null,
					sourceType: 'module',
				},
			},
			name: 'petal/vue/rules',
			processor: sfcBlocks === false
				? pluginVue.processors['.vue']
				: mergeProcessors([
					pluginVue.processors['.vue'],
					(await interopDefault(import('eslint-processor-vue-blocks')))({
						...sfcBlocks,
						blocks: {
							styles: true,
							...sfcBlocks.blocks,
						},
					}),
				]),
			rules: {
				...pluginVue.configs.base.rules as any,

				...vueVersion === 2
					? {
							...pluginVue.configs.essential.rules as any,
							...pluginVue.configs['strongly-recommended'].rules as any,
							...pluginVue.configs.recommended.rules as any,
						}
					: {
							...pluginVue.configs['vue3-essential'].rules as any,
							...pluginVue.configs['vue3-strongly-recommended'].rules as any,
							...pluginVue.configs['vue3-recommended'].rules as any,
						},

				'node/prefer-global/process': 'off',
				'vue/block-order': ['error', {
					order: ['script', 'template', 'style'],
				}],

				'vue/component-name-in-template-casing': ['error', 'PascalCase'],
				'vue/component-options-name-casing': ['error', 'PascalCase'],
				'vue/component-tags-order': 'off',
				'vue/custom-event-name-casing': ['error', 'camelCase'],
				'vue/define-macros-order': ['error', {
					order: ['defineOptions', 'defineProps', 'defineEmits', 'defineSlots'],
				}],
				'vue/dot-location': ['error', 'property'],
				'vue/dot-notation': ['error', { allowKeywords: true }],
				'vue/eqeqeq': ['error', 'smart'],
				'vue/html-indent': ['error', indent],
				'vue/html-quotes': ['error', 'double'],
				'vue/max-attributes-per-line': 'off',
				'vue/multi-word-component-names': 'off',
				'vue/no-dupe-keys': 'off',
				'vue/no-empty-pattern': 'error',
				'vue/no-irregular-whitespace': 'error',
				'vue/no-loss-of-precision': 'error',
				'vue/no-restricted-syntax': [
					'error',
					'DebuggerStatement',
					'LabeledStatement',
					'WithStatement',
				],
				'vue/no-restricted-v-bind': ['error', '/^v-/'],
				'vue/no-setup-props-reactivity-loss': 'off',
				'vue/no-sparse-arrays': 'error',
				'vue/no-unused-refs': 'error',
				'vue/no-useless-v-bind': 'error',
				'vue/no-v-html': 'off',
				'vue/object-shorthand': [
					'error',
					'always',
					{
						avoidQuotes: true,
						ignoreConstructors: false,
					},
				],
				'vue/prefer-separate-static-class': 'error',
				'vue/prefer-template': 'error',
				'vue/prop-name-casing': ['error', 'camelCase'],
				'vue/require-default-prop': 'off',
				'vue/require-prop-types': 'off',
				'vue/space-infix-ops': 'error',
				'vue/space-unary-ops': ['error', { nonwords: false, words: true }],

				...accessibility
					? {
							'vue-a11y/alt-text': 'error',
							'vue-a11y/anchor-has-content': 'error',
							'vue-a11y/aria-props': 'error',
							'vue-a11y/aria-role': 'error',
							'vue-a11y/aria-unsupported-elements': 'error',
							'vue-a11y/click-events-have-key-events': 'error',
							'vue-a11y/form-control-has-label': 'error',
							'vue-a11y/heading-has-content': 'error',
							'vue-a11y/iframe-has-title': 'error',
							'vue-a11y/interactive-supports-focus': 'error',
							'vue-a11y/label-has-for': 'error',
							'vue-a11y/media-has-caption': 'error',
							'vue-a11y/mouse-events-have-key-events': 'error',
							'vue-a11y/no-access-key': 'error',
							'vue-a11y/no-autofocus': 'error',
							'vue-a11y/no-distracting-elements': 'error',
							'vue-a11y/no-redundant-roles': 'error',
							'vue-a11y/no-static-element-interactions': 'error',
							'vue-a11y/role-has-required-aria-props': 'error',
							'vue-a11y/tabindex-no-positive': 'error',
						}
					: {},

				...stylistic
					? {
							'vue/array-bracket-spacing': ['error', 'never'],
							'vue/arrow-spacing': ['error', { after: true, before: true }],
							'vue/block-spacing': ['error', 'always'],
							'vue/block-tag-newline': ['error', {
								multiline: 'always',
								singleline: 'always',
							}],
							'vue/brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
							'vue/comma-dangle': ['error', 'always-multiline'],
							'vue/comma-spacing': ['error', { after: true, before: false }],
							'vue/comma-style': ['error', 'last'],
							'vue/html-comment-content-spacing': ['error', 'always', {
								exceptions: ['-'],
							}],
							'vue/key-spacing': ['error', { afterColon: true, beforeColon: false }],
							'vue/keyword-spacing': ['error', { after: true, before: true }],
							'vue/object-curly-newline': 'off',
							'vue/object-curly-spacing': ['error', 'always'],
							'vue/object-property-newline': ['error', { allowMultiplePropertiesPerLine: true }],
							'vue/operator-linebreak': ['error', 'before'],
							'vue/padding-line-between-blocks': ['error', 'always'],
							'vue/quote-props': ['error', 'consistent-as-needed'],
							'vue/space-in-parens': ['error', 'never'],
							'vue/template-curly-spacing': 'error',
						}
					: {},

				...overrides,
			},
		},
	];
}
