import { defineConfig } from '@flowr/eslint';

export default defineConfig({
	ignores: ['fixtures', '_fixtures', '**/_fixtures/**', '**/fixtures/**'],
	type: 'lib',
	typescript: {
		overridesTypeAware: {
			'ts/no-unsafe-argument': 'off',
			'ts/no-unsafe-assignment': 'off',
			'ts/no-unsafe-member-access': 'off',
			'ts/no-unsafe-return': 'off',
			'ts/strict-boolean-expressions': 'off',
		},
		tsconfigPath: 'tsconfig.json',
	},
});
