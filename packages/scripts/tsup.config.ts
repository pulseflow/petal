import { defineConfig, type Options } from 'tsup';
import { capitalizeFirstLetter } from '../utilities/src/lib/capitalizeFirstLetter';

// @keep-sorted
const baseOptions: Options = {
	bundle: true,
	cjsInterop: true,
	clean: true,
	dts: true,
	entry: ['src/index.ts'],
	esbuildPlugins: [],
	experimentalDts: false,
	external: [],
	ignoreWatch: [],
	inject: [],
	injectStyle: false,
	keepNames: true,
	killSignal: 'SIGTERM',
	legacyOutput: false,
	metafile: false,
	minify: false,
	noExternal: ['@flowr/utilities', '@flowr/types'],
	platform: 'neutral',
	publicDir: false,
	pure: [],
	removeNodeProtocol: false,
	replaceNodeEnv: false,
	shims: true,
	silent: true,
	skipNodeModulesBundle: true,
	sourcemap: true,
	target: ['esnext'],
	terserOptions: {
		keep_classnames: true,
		keep_fnames: true,
		mangle: false,
	},
	treeshake: {
		preset: 'smallest',
	},
	watch: false,
};

export interface TsupDisabled extends Options {
	disabled?: boolean;
}

export interface ExtendedTsupOptions {
	esmOptions?: Options;
	cjsOptions?: TsupDisabled;
	iifeOptions?: TsupDisabled;
}

export function createTsupConfig(name: string | TemplateStringsArray, options: ExtendedTsupOptions = {}): Array<ReturnType<typeof defineConfig>> {
	name = name.toString();
	const globalName = `Pulse${capitalizeFirstLetter(name)}`;

	return [
		defineConfig({
			name: `${name}/esm`,
			...baseOptions,
			format: 'esm',
			outDir: 'dist/esm',
			outExtension: () => ({ dts: '.d.ts', js: '.js' }),
			...options.esmOptions,
		}),
		...options.cjsOptions?.disabled
			? []
			: [defineConfig({
					name: `${name}/cjs`,
					...baseOptions,
					format: 'cjs',
					outDir: 'dist/cjs',
					outExtension: () => ({ dts: '.d.cts', js: '.cjs' }),
					...options.cjsOptions,
				})],
		...options.iifeOptions?.disabled
			? []
			: [defineConfig({
					...baseOptions,
					dts: false,
					entry: ['src/index.ts'],
					format: 'iife',
					globalName,
					name: `${name}/iife`,
					outDir: 'dist/iife',
					...options.iifeOptions,
				})],
	];
}
