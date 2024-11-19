import type { AbstractCtor } from '@flowr/types';
import { readFileSync } from 'node:fs';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { isNullish } from '@flowr/utilities/isNullish';
import { dirname, join } from 'pathe';

export const VirtualPath = '::virtual::';
export const ManuallyRegisteredPiecesSymbol: unique symbol = Symbol('@flowr/pieces:ManuallyRegisteredPieces');
export type Path = string | URL;

export function resolvePath(path: Path): string {
	if (typeof path === 'string')
		return path;
	return fileURLToPath(path);
}

/**
 * Represents a partial package.json object.
 */
type PartialPackageJson = Partial<{ main: string; module: string; type: 'commonjs' | 'module' }>;

/**
 * Represents the root data.
 */
export interface RootData {
	/**
	 * The root directory.
	 */
	root: string;

	/**
	 * The type of the module system used.
	 * It can be either 'ESM' or 'CommonJS'.
	 */
	type: 'ESM' | 'CommonJS';
}

let data: RootData | null = null;

/**
 * Returns the directory name of a given path by joining the current working directory (cwd) with the joinable path.
 * @private
 * @param cwd - The current working directory.
 * @param joinablePath - The path to be joined with the cwd.
 * @returns The directory name of the joined path.
 */
const dirnameWithPath = (cwd: string, joinablePath: string): string => dirname(join(cwd, joinablePath));

/**
 * Get the {@link RootData} of the current project.
 * @returns The root data
 */
export const getRootData = (): RootData => (data ??= parseRootData());

/**
 * Retrieves the root data of the project.
 *
 * This function reads the `package.json` file in the current working directory and determines the root path and type
 * of the project.
 *
 * - If the `package.json` file is not found or cannot be parsed, it assumes the project is using CommonJS and
 * the current working directory is used as the root
 *
 * - If the project `type` is specified as `"commonjs"` or `"module"` in the `package.json`, it uses the corresponding
 * `main` or `module` file path as the root.
 *
 *   - If there is no `main` or `module` then it uses the current working directory as the root, while retaining the
 *     matching `CommonJS` or `ESM` based on the `type`
 *
 * - If the main or module file path is not specified, it uses the current working directory as the root.
 *
 * The following table shows how different situations resolve to different root data:
 *
 * | Fields                   | Resolved as |
 * |--------------------------|-------------|
 * | type=commonjs && main    | CommonJS    |
 * | type=commonjs && module  | CommonJS    |
 * | type=module && main      | ESM         |
 * | type=module && module    | ESM         |
 * | type=undefined && main   | CommonJS    |
 * | type=undefined && module | ESM         |
 * | no package.json on cwd   | CommonJS    |
 *
 * @returns The root data object containing the root path and the type of the project.
 */
export function parseRootData(): RootData {
	const cwd = process.cwd();
	let file: PartialPackageJson | undefined;

	try {
		file = JSON.parse(readFileSync(join(cwd, 'package.json'), 'utf8')) as PartialPackageJson;
	}
	catch {
		return { root: cwd, type: 'CommonJS' };
	}

	const lowerCasedType = file.type?.toLowerCase() as PartialPackageJson['type'];

	if (lowerCasedType === 'commonjs') {
		if (file.main)
			return { root: dirnameWithPath(cwd, file.main), type: 'CommonJS' };
		if (file.module)
			return { root: dirnameWithPath(cwd, file.module), type: 'CommonJS' };
		return { root: cwd, type: 'CommonJS' };
	}

	if (lowerCasedType === 'module') {
		if (file.main)
			return { root: dirnameWithPath(cwd, file.main), type: 'ESM' };
		if (file.module)
			return { root: dirnameWithPath(cwd, file.module), type: 'ESM' };
		return { root: cwd, type: 'ESM' };
	}

	if (file.main)
		return { root: dirnameWithPath(cwd, file.main), type: 'CommonJS' };
	if (file.module)
		return { root: dirnameWithPath(cwd, file.module), type: 'ESM' };

	return { root: cwd, type: 'CommonJS' };
}

const checkProcessArgv = (name: string): boolean => (process.execArgv.some(arg => arg.includes(name)) || process.argv.some(arg => arg.includes(name)));
const checkPreloadModules = (name: string): boolean => '_preload_modules' in process && (process._preload_modules as string[]).some(module => module.includes(name));
const checkEnvVariable = (name: string, value?: string): boolean => value ? process.env[name] === value : !isNullish(process.env[name]);

/**
 * Whether or not the current environment can load TypeScript files. These
 * conditions are based on the most common tools and runtimes that support
 * loading TypeScript files directly.
 *
 * - {@linkplain https://www.npmjs.com/package/ts-node | `ts-node`}
 * - {@linkplain https://www.npmjs.com/package/ts-node-dev | `ts-node-dev`}
 * - {@linkplain https://www.npmjs.com/package/@babel/node | `@babel/node`}
 * - {@linkplain https://www.npmjs.com/package/vitest | `vitest`}
 * - {@linkplain https://www.npmjs.com/package/jest | `jest`}
 * - {@linkplain https://www.npmjs.com/package/@swc/cli | `swc`}
 * - {@linkplain https://www.npmjs.com/package/tsm | `tsm`}
 * - {@linkplain https://www.npmjs.com/package/esbuild | `esbuild`}
 * - {@linkplain https://www.npmjs.com/package/tsx | `tsx + esno`}
 * - {@linkplain https://deno.com | `deno`}
 * - {@linkplain https://bun.sh | `bun`}
 */
export const CanLoadTypeScriptFiles: boolean
	= Reflect.has(globalThis, 'Deno') // deno
	|| 'bun' in process.versions // bun
	|| Symbol.for('ts-node.register.instance') in process // ts-node/register
	|| checkProcessArgv('ts-node/esm') // ts-node/esm
	|| !isNullish(process.env.TS_NODE_DEV) // ts-node-dev
	|| checkProcessArgv('babel-node') // @babel/node
	|| checkEnvVariable('VITEST', 'true') // vitest
	|| checkEnvVariable('VITEST_WORKER_ID') // vitest/worker
	|| checkEnvVariable('JEST_WORKER_ID') // jest
	|| checkPreloadModules('@swc/register') // swc/register
	|| checkPreloadModules('@swc-node/register') // swc-node/register
	|| checkProcessArgv('.bin/swc-node') // swc-node
	|| checkPreloadModules('tsm') // tsm
	|| checkPreloadModules('esbuild-register') // esbuild
	|| checkPreloadModules('tsx'); // tsx

/**
 * Determines whether or not a value is a class.
 * @param value The piece to be checked.
 * @private
 */
export const isClass = (value: unknown): value is AbstractCtor => typeof value === 'function' && typeof value.prototype === 'object';

/**
 * Checks whether or not the value class extends the base class.
 * @param value The constructor to be checked against.
 * @param base The base constructor.
 * @private
 */
export function classExtends<T extends AbstractCtor>(value: AbstractCtor, base: T): value is T {
	let ctor: AbstractCtor | null = value;
	while (ctor !== null) {
		if (ctor === base)
			return true;
		ctor = Object.getPrototypeOf(ctor);
	}

	return false;
}
