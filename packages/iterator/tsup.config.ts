import type { Options } from 'tsup';
import { esbuildPluginFilePathExtensions } from 'esbuild-plugin-file-path-extensions';
import { createTsupConfig } from '../scripts/tsup.config.js';

const options: Options = {
	bundle: true,
	entry: ['src/**/*.ts'],
	esbuildPlugins: [esbuildPluginFilePathExtensions()],
};

export default createTsupConfig('iterator', {
	cjsOptions: options,
	esmOptions: options,
});
