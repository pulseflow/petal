import type { Options } from 'tsup';
import { createTsupConfig } from '../scripts/tsup.config.js';

const options: Options = {
	external: ['@typescript-eslint/utils'],
};

export default createTsupConfig('eslint-plugin', {
	cjsOptions: options,
	esmOptions: options,
	iifeOptions: { disabled: true },
});
