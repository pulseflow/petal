import type { Options } from 'tsup';
import { esbuildPluginFilePathExtensions } from 'esbuild-plugin-file-path-extensions';
import { createTsupConfig } from '../scripts/tsup.config.ts';

const options: Options = {
	entry: ['src/**'],
	esbuildPlugins: [esbuildPluginFilePathExtensions()],
};

export default createTsupConfig('store', {
	cjs: options,
	esm: options,
	iife: { disabled: true },
});
