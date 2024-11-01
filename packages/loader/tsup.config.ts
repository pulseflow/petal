import type { Options } from 'tsup';
import { esbuildPluginFilePathExtensions } from 'esbuild-plugin-file-path-extensions';
import { createTsupConfig } from '../scripts/tsup.config.js';

const options: Options = {
	entry: ['src/**'],
	esbuildPlugins: [esbuildPluginFilePathExtensions()],
};

export default createTsupConfig('store', {
	cjsOptions: options,
	esmOptions: options,
	iifeOptions: { disabled: true },
});
