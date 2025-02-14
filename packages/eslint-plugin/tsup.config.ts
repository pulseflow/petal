import { createTsupConfig } from '../scripts/tsup.config.ts';

export default createTsupConfig('eslint-plugin', {
	esm: {
		external: ['@typescript-eslint/utils'],
	},
	iife: { disabled: true },
});
