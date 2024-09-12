import type { OptionsUnoCSS, TypedFlatConfigItem } from '../types';
import { ensurePackages, interopDefault } from '../utils';

export async function unocss(options: OptionsUnoCSS = {}): Promise<TypedFlatConfigItem[]> {
	const { attributify = true, strict = false } = options;
	await ensurePackages(['@unocss/eslint-plugin']);
	const pluginUnoCSS = await interopDefault(import('@unocss/eslint-plugin'));

	return [
		{
			name: 'petal/unocss',
			plugins: {
				unocss: pluginUnoCSS,
			},
			rules: {
				'unocss/order': 'warn',
				...attributify
					? {
							'unocss/order-attributify': 'warn',
						}
					: {},
				...strict
					? {
							'unocss/blocklist': 'error',
						}
					: {},
			},
		},
	];
}
