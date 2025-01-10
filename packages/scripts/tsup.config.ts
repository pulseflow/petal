import { defineConfig, type Options } from 'tsup';
import { capitalizeFirstLetter } from '../utilities/src/lib/capitalizeFirstLetter';

// @keep-sorted
export const baseOptions: Options = {
	bundle: true,
	cjsInterop: true,
	clean: true,
	dts: true,
	entry: ['src/index.ts'],
	esbuildPlugins: [],
	experimentalDts: false,
	external: undefined,
	ignoreWatch: [],
	inject: [],
	injectStyle: false,
	keepNames: true,
	killSignal: 'SIGTERM',
	legacyOutput: false,
	metafile: false,
	minify: false,
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

export const outExtension: Options['outExtension'] = (context) => {
	if (context.format === 'cjs')
		return ({ dts: '.d.cts', js: '.cjs' });
	else if (context.format === 'iife')
		return ({ dts: '.d.ts', js: '.js' });
	else return {};
};

export type TsupDisabled = Options & { disabled?: boolean };
export interface ExtendedTsupOptions { esm?: Options; cjs?: TsupDisabled; iife?: TsupDisabled }

export function createTsupConfig(name: string | TemplateStringsArray, options: ExtendedTsupOptions = {}): Array<ReturnType<typeof defineConfig>> {
	name = name.toString();
	const globalName = `Pulse${capitalizeFirstLetter(name)}`;

	return [
		defineConfig({
			name: `${name}/esm`,
			...baseOptions,
			format: 'esm',
			outDir: 'dist/esm',
			outExtension,
			...options.esm,
		}),
		...options.cjs?.disabled
			? []
			: [defineConfig({
					name: `${name}/cjs`,
					...baseOptions,
					format: 'cjs',
					outDir: 'dist/cjs',
					outExtension,
					...options.cjs,
				})],
		...options.iife?.disabled
			? []
			: [defineConfig({
					...baseOptions,
					dts: false,
					entry: ['src/index.ts'],
					format: 'iife',
					target: ['esnext', 'firefox78', 'edge88', 'safari14', 'chrome87'],
					globalName,
					name: `${name}/iife`,
					outDir: 'dist/iife',
					...options.iife,
				})],
	];
}
