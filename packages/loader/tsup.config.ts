import { esbuildPluginFilePathExtensions } from 'esbuild-plugin-file-path-extensions';
import { createTsupConfig } from '../scripts/tsup.config.ts';

export default createTsupConfig('store', {
	esm: {
		entry: ['src/**'],
		esbuildPlugins: [esbuildPluginFilePathExtensions()],
	},
	iife: { disabled: true },
});
