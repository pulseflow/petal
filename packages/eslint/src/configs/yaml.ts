import type { OptionsYaml, TypedFlatConfigItem } from '../types/index.ts';
import { GLOB_YAML } from '../globs.ts';
import { interopDefault } from '../utils.ts';

export async function yaml(options: OptionsYaml = {}): Promise<TypedFlatConfigItem[]> {
	const stylistic = options.stylistic ?? true;
	const { indent = 2, quotes = 'single' } = typeof stylistic === 'boolean' ? {} : stylistic;

	const [
		pluginYaml,
		parserYaml,
	] = await Promise.all([
		interopDefault(import('eslint-plugin-yml')),
		interopDefault(import('yaml-eslint-parser')),
	] as const);

	return [
		{
			name: 'petal/yaml/setup',
			plugins: {
				yaml: pluginYaml,
			},
		},
		{
			files: options.files ?? [GLOB_YAML],
			languageOptions: {
				parser: parserYaml,
			},
			name: 'petal/yaml/rules',
			rules: {
				'style/spaced-comment': 'off',

				'yaml/block-mapping': 'error',
				'yaml/block-sequence': 'error',
				'yaml/no-empty-key': 'error',
				'yaml/no-empty-sequence-entry': 'error',
				'yaml/no-irregular-whitespace': 'error',
				'yaml/plain-scalar': 'error',
				'yaml/vue-custom-block/no-parsing-error': 'error',

				...stylistic
					? {
							'yaml/block-mapping-question-indicator-newline': 'error',
							'yaml/block-sequence-hyphen-indicator-newline': 'error',
							'yaml/flow-mapping-curly-newline': 'error',
							'yaml/flow-mapping-curly-spacing': 'error',
							'yaml/flow-sequence-bracket-newline': 'error',
							'yaml/flow-sequence-bracket-spacing': 'error',
							'yaml/indent': ['error', indent === 'tab' ? 2 : indent],
							'yaml/key-spacing': 'error',
							'yaml/no-tab-indent': 'error',
							'yaml/quotes': ['error', { avoidEscape: true, prefer: quotes === 'backtick' ? 'single' : quotes }],
							'yaml/spaced-comment': 'error',
						}
					: {},

				...options.overrides ?? {},
			},
		},
	];
}
