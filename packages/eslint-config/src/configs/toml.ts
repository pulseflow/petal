import { GLOB_TOML } from '../globs';
import { interopDefault } from '../utils';
import type { OptionsToml, TypedFlatConfigItem } from '../types';

export async function toml(options: OptionsToml = {}): Promise<TypedFlatConfigItem[]> {
	const { files = [GLOB_TOML], overrides = {}, stylistic = true } = options;
	const { indent = 'tab' } = typeof stylistic === 'boolean' ? {} : stylistic;

	const [pluginToml, parserToml] = await Promise.all([
		interopDefault(import('eslint-plugin-toml')),
		interopDefault(import('toml-eslint-parser')),
	] as const);

	return [
		{
			name: 'petal/toml/setup',
			plugins: {
				toml: pluginToml,
			},
		},
		{
			files,
			languageOptions: {
				parser: parserToml,
			},
			name: 'petal/toml/rules',
			rules: {
				'style/spaced-comment': 'off',

				'toml/comma-style': 'error',
				'toml/keys-order': 'error',
				'toml/no-mixed-type-in-array': 'error',
				'toml/no-space-dots': 'error',
				'toml/no-unreadable-number-separator': 'error',
				'toml/precision-of-fractional-seconds': 'error',
				'toml/precision-of-integer': 'error',
				'toml/tables-order': 'error',

				'toml/vue-custom-block/no-parsing-error': 'error',

				...stylistic
					? {
							'toml/array-bracket-newline': 'error',
							'toml/array-bracket-spacing': 'error',
							'toml/array-element-newline': ['error', { minItems: 4 }],
							'toml/indent': ['error', indent],
							'toml/inline-table-curly-spacing': 'error',
							'toml/key-spacing': 'error',
							'toml/padding-line-between-pairs': 'error',
							'toml/padding-line-between-tables': 'error',
							'toml/quoted-keys': 'error',
							'toml/spaced-comment': 'error',
							'toml/table-bracket-spacing': 'error',
						}
					: {},

				...overrides,
			},
		},
	];
}
