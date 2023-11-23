import type {
	FlatConfigItem,
	OptionsComponentExts,
	OptionsFiles,
	OptionsOverrides,
} from '../types.js';
import { GLOB_MARKDOWN, GLOB_MARKDOWN_CODE } from '../globs.js';
import { interopDefault } from '../utils.js';

export async function markdown(options: OptionsFiles & OptionsComponentExts & OptionsOverrides = {}): Promise<FlatConfigItem[]> {
	const { componentExts = [], files = [GLOB_MARKDOWN], overrides = {} } = options;

	return [
		{
			name: 'petal:markdown:setup',
			plugins: {
				// @ts-expect-error missing types
				markdown: await interopDefault(import('eslint-plugin-markdown')),
			},
		},
		{
			files,
			name: 'petal:markdown:processor',
			processor: 'markdown/markdown',
		},
		{
			files: [
				GLOB_MARKDOWN_CODE,
				...componentExts.map(f => `${GLOB_MARKDOWN}/**/*.${f}`),
			],
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						impliedStrict: true,
					},
				},
			},
			name: 'petal:markdown:rules',
			rules: {
				'import/newline-after-import': 'off',
				'no-alert': 'off',
				'no-console': 'off',
				'no-labels': 'off',
				'no-lone-blocks': 'off',
				'no-restricted-syntax': 'off',
				'no-undef': 'off',
				'no-unused-expressions': 'off',
				'no-unused-labels': 'off',
				'no-unused-vars': 'off',
				'node/prefer-global/process': 'off',

				'petal/no-ts-export-equal': 'off',
				'style/comma-dangle': 'off',

				'style/eol-last': 'off',
				'ts/consistent-type-imports': 'off',
				'ts/no-namespace': 'off',
				'ts/no-redeclare': 'off',
				'ts/no-require-imports': 'off',
				'ts/no-unused-vars': 'off',
				'ts/no-use-before-define': 'off',
				'ts/no-var-requires': 'off',

				'unicode-bom': 'off',
				'unused-imports/no-unused-imports': 'off',
				'unused-imports/no-unused-vars': 'off',

				...{
					'ts/await-thenable': 'off',
					'ts/dot-notation': 'off',
					'ts/no-floating-promises': 'off',
					'ts/no-for-in-array': 'off',
					'ts/no-implied-eval': 'off',
					'ts/no-misused-promises': 'off',
					'ts/no-throw-literal': 'off',
					'ts/no-unnecessary-type-assertion': 'off',
					'ts/no-unsafe-argument': 'off',
					'ts/no-unsafe-assignment': 'off',
					'ts/no-unsafe-call': 'off',
					'ts/no-unsafe-member-access': 'off',
					'ts/no-unsafe-return': 'off',
					'ts/restrict-plus-operands': 'off',
					'ts/restrict-template-expressions': 'off',
					'ts/unbound-method': 'off',
				},

				...overrides,
			},
		},
	];
}
