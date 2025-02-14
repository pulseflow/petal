import { esbuildPluginFilePathExtensions } from 'esbuild-plugin-file-path-extensions';
import { createTsupConfig } from '../scripts/tsup.config.ts';

export default createTsupConfig('iterator', {
	esm: {
		bundle: true,
		entry: ['src/**/*.ts'],
		esbuildPlugins: [esbuildPluginFilePathExtensions()],
	},
});
