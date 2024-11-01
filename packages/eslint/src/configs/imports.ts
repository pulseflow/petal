import type { FileExtension, ImportResolver } from 'eslint-plugin-import-x/types.js';
import type { OptionsImports, TypedFlatConfigItem } from '../types/index.ts';
import { interopDefault } from '../utils.ts';

export async function imports(options: OptionsImports = {}): Promise<TypedFlatConfigItem[]> {
	const [pluginImport, pluginPetal] = await Promise.all([
		interopDefault(import('eslint-plugin-import-x')),
		interopDefault(import('eslint-plugin-petal')),
	] as const);

	const importResolver: ImportResolver = {
		node: {
			extensions: ['.js', '.jsx', ...options.typescript ? ['.ts', '.tsx'] : []],
			...options.typescript && { typescript: options.tsResolverOptions ?? true },
		},
	};

	const importParsers: Record<string, readonly FileExtension[]> = {
		'@typescript-eslint/parser': ['.ts', '.tsx'],
	};

	return [
		{
			name: 'petal/imports/rules',
			plugins: {
				import: pluginImport,
				petal: pluginPetal,
			},
			rules: {
				'import/first': 'error',
				'import/no-duplicates': 'error',
				'import/no-mutable-exports': 'error',
				'import/no-named-default': 'error',
				'import/no-self-import': 'error',
				'import/no-webpack-loader-syntax': 'error',

				'petal/import-dedupe': 'error',
				'petal/no-import-dist': 'error',
				'petal/no-import-node-modules-by-path': 'error',

				...options.stylistic ?? true
					? {
							'import/newline-after-import': ['error', { count: 1 }],
						}
					: {},

				...options.overrides ?? {},
			},
			settings: {
				...options.typescript && { 'import-x/parsers': importParsers },
				'import-x/resolver': importResolver,
			},
		},
	];
}
