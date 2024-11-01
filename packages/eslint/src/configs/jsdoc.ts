import type { OptionsJSDoc, TypedFlatConfigItem } from '../types/index.ts';
import { interopDefault } from '../utils.ts';

export async function jsdoc(options: OptionsJSDoc = {}): Promise<TypedFlatConfigItem[]> {
	const pluginJSDoc = await interopDefault(import('eslint-plugin-jsdoc'));

	return [
		{
			name: 'petal/jsdoc/rules',
			plugins: {
				jsdoc: pluginJSDoc,
			},
			rules: {
				'jsdoc/check-access': 'warn',
				'jsdoc/check-param-names': 'warn',
				'jsdoc/check-property-names': 'warn',
				'jsdoc/check-types': 'warn',
				'jsdoc/empty-tags': 'warn',
				'jsdoc/implements-on-classes': 'warn',
				'jsdoc/no-defaults': 'warn',
				'jsdoc/no-multi-asterisks': 'warn',
				'jsdoc/require-param-name': 'warn',
				'jsdoc/require-property': 'warn',
				'jsdoc/require-property-description': 'warn',
				'jsdoc/require-property-name': 'warn',
				'jsdoc/require-returns-check': 'warn',
				'jsdoc/require-returns-description': 'warn',
				'jsdoc/require-yields-check': 'warn',

				...options.stylistic ?? true
					? {
							'jsdoc/check-alignment': 'error',
							'jsdoc/multiline-blocks': 'warn',
						}
					: {},

				...options.overrides ?? {},
			},
		},
	];
}
