import { mergeProcessors, processorPassThrough } from 'eslint-merge-processors';
import type {
	OptionsComponentExts,
	OptionsFiles,
	OptionsOverrides,
	TypedFlatConfigItem,
} from '../types.js';
import { GLOB_MARKDOWN, GLOB_MARKDOWN_CODE, GLOB_MARKDOWN_IN_MARKDOWN } from '../globs.js';
import { interopDefault, parserPlain } from '../utils.js';

export async function markdown(options: OptionsFiles & OptionsComponentExts & OptionsOverrides = {}): Promise<TypedFlatConfigItem[]> {
	const { componentExts = [], files = [GLOB_MARKDOWN], overrides = {} } = options;

	// @ts-expect-error missing types
	const markdown = await interopDefault(import('eslint-plugin-markdown'));

	return [
		{
			name: 'petal:markdown:setup',
			plugins: {
				markdown,
			},
		},
		{
			files,
			ignores: [GLOB_MARKDOWN_IN_MARKDOWN],
			name: 'petal:markdown:processor',
			// `eslint-plugin-markdown` only creates virtual files for code blocks,
			// but not the markdown file itself. we use `eslint-merge-processors` to
			// add a pass-through processor for themarkdown file itself.
			processor: mergeProcessors([
				markdown.processors.markdown,
				processorPassThrough,
			]),
		},
		{
			files,
			languageOptions: {
				parser: parserPlain,
			},
			name: 'petal:markdown:parser',
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
			name: 'petal:markdown:disables',
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
