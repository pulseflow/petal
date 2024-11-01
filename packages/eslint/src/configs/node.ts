import type { TypedFlatConfigItem } from '../types/index.ts';
import { interopDefault } from '../utils.ts';

export async function node(): Promise<TypedFlatConfigItem[]> {
	const pluginNode = await interopDefault(import('eslint-plugin-n'));

	return [
		{
			name: 'petal/node/rules',
			plugins: {
				node: pluginNode,
			},
			rules: {
				'node/handle-callback-err': ['error', '^(err|error)$'],
				'node/no-deprecated-api': 'error',
				'node/no-exports-assign': 'error',
				'node/no-new-require': 'error',
				'node/no-path-concat': 'error',
				'node/prefer-global/buffer': ['error', 'never'],
				'node/prefer-global/process': ['error', 'never'],
				'node/prefer-global/text-decoder': ['error', 'never'],
				'node/prefer-global/text-encoder': ['error', 'never'],
				'node/prefer-global/url-search-params': ['error', 'never'],
				'node/process-exit-as-throw': 'error',
			},
		},
	];
}
