import type { OptionsSchema, TypedFlatConfigItem } from '../types';
import { GLOB_JSON, GLOB_JSON5, GLOB_JSONC, GLOB_TOML, GLOB_YAML } from '../globs';
import { ensurePackages, interopDefault } from '../utils';

export async function schema(options: OptionsSchema = {}): Promise<TypedFlatConfigItem[]> {
	const { files = [GLOB_JSON, GLOB_JSON5, GLOB_JSONC, GLOB_YAML, GLOB_TOML], overrides = {} } = options;
	await ensurePackages(['eslint-plugin-json-schema-validator']);
	const pluginSchema = await interopDefault(import('eslint-plugin-json-schema-validator'));

	return [
		{
			name: 'petal/schema/setup',
			plugins: {
				schema: pluginSchema,
			},
		},
		{
			files,
			name: 'petal/schema/rules',
			rules: {
				'schema/no-invalid': 'error',
				...overrides,
			},
		},
	];
}
