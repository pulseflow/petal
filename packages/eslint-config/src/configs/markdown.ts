import { mergeProcessors, processorPassThrough } from 'eslint-merge-processors';
import { GLOB_MARKDOWN, GLOB_MARKDOWN_CODE, GLOB_MARKDOWN_IN_MARKDOWN } from '../globs';
import { interopDefault, parserPlain } from '../utils';
import type { OptionsMarkdown, TypedFlatConfigItem } from '../types';

export async function markdown(options: OptionsMarkdown = {}): Promise<TypedFlatConfigItem[]> {
	const { componentExts = [], files = [GLOB_MARKDOWN], overrides = {} } = options;
	const pluginMarkdown = await interopDefault(import('@eslint/markdown'));

	return [
		{
			name: 'petal/markdown/setup',
			plugins: {
				markdown: pluginMarkdown,
			},
		},
		{
			files,
			ignores: [GLOB_MARKDOWN_IN_MARKDOWN],
			name: 'petal/markdown/processor',
			// `@eslint/markdown` only creates virtual files for code blocks,
			// but not the markdown file itself. we use `eslint-merge-processors` to
			// add a pass-through processor for the markdown file itself.
			processor: mergeProcessors([
				pluginMarkdown.processors!.markdown,
				processorPassThrough,
			]),
		},
		{
			files,
			languageOptions: {
				parser: parserPlain,
			},
			name: 'petal/markdown/parser',
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
			name: 'petal/markdown/disables',
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
				'ts/no-unused-expressions': 'off',
				'ts/no-unused-vars': 'off',
				'ts/no-use-before-define': 'off',

				'unicode-bom': 'off',
				'unused-imports/no-unused-imports': 'off',
				'unused-imports/no-unused-vars': 'off',

				...overrides,
			},
		},
	];
}
