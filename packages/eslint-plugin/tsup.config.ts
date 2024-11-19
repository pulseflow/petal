import type { Options } from 'tsup';
import { createTsupConfig } from '../scripts/tsup.config.ts';

const options: Options = {
	external: ['@typescript-eslint/utils'],
};

export default createTsupConfig('eslint-plugin', {
	cjs: options,
	esm: options,
	iife: { disabled: true },
});
