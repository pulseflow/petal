import type { Options } from 'tsup';
import { createTsupConfig } from '../scripts/tsup.config.ts';

const options: Options = { shims: true, sourcemap: false };

export default createTsupConfig('eslint', {
	cjsOptions: options,
	esmOptions: options,
	iifeOptions: { disabled: true },
});
