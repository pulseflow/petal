import fs from 'node:fs';
import process from 'node:process';
import nodePath from 'node:path';

/**
 * A function that takes a set of path fragments and resolves them into a
 * single complete path, relative to some root.
 *
 * @public
 */
export type ResolveFunc = (...paths: string[]) => string;

/**
 * An interface to resolve paths within a monorepo
 *
 * @public
 */
export interface Paths {
	// Root dir of ourselves, containing package.json
	ownDir: string;

	// Monorepo root dir of ourselves
	ownRoot: string;

	// The location of the app that we are being injected in
	targetDir: string;

	// The monorepo root package of the app we are being injected in
	targetRoot: string;

	// Resolve a path relative to our own repo
	resolveOwn: ResolveFunc;

	// Resolve a path relative to our own monorepo root.
	resolveOwnRoot: ResolveFunc;

	// Resolve a path relative to the app
	resolveTarget: ResolveFunc;

	// Resolve a path relative to the app repo root
	resolveTargetRoot: ResolveFunc;
}

// Looks for a package.json with a workspace config to identify the root of the monorepo
export function findRootPath(searchDir: string,	filterFunc: (pkgJsonPath: string) => boolean): string | undefined {
	let path = searchDir;

	for (let i = 0; i < 1000; i++) {
		const packagePath = nodePath.resolve(path, 'package.json');
		const exists = fs.existsSync(packagePath);
		if (exists && filterFunc(packagePath))
			return path;

		const newPath = nodePath.dirname(path);
		if (newPath === path)
			return undefined;

		path = newPath;
	}

	throw new Error(
		`Iteration limit reached when searching for root package.json at ${searchDir}`,
	);
}

export function findOwnDir(searchDir: string) {
	const path = findRootPath(searchDir, () => true);
	if (!path) {
		throw new Error(
			`No package.json found while searching for package root of ${searchDir}`,
		);
	}
	return path;
}

export function findOwnRootDir(ownDir: string) {
	const isLocal = fs.existsSync(nodePath.resolve(ownDir, 'src'));
	if (!isLocal) {
		throw new Error(
			'Failed to access monorepo package root dir',
		);
	}

	return nodePath.resolve(ownDir, '../..');
}

/**
 * Find paths related to a package and its execution context.
 *
 * @public
 * @example
 *
 * const paths = findPaths(__dirname)
 */
export function findPaths(searchDir: string): Paths {
	const ownDir = findOwnDir(searchDir);
	const targetDir = fs
		.realpathSync(process.cwd())
		.replace(/^[a-z]:/, str => str.toLocaleUpperCase('en-US'));

	let ownRoot = '';
	const getOwnRoot = () => {
		if (!ownRoot)
			ownRoot = findOwnRootDir(ownDir);

		return ownRoot;
	};

	let targetRoot = '';
	const getTargetRoot = () => {
		if (!targetRoot) {
			targetRoot
				= findRootPath(targetDir, (path) => {
					try {
						const content = fs.readFileSync(path, 'utf8');
						const data = JSON.parse(content);
						return Boolean(data.workspaces?.packages);
					}
					catch (error) {
						throw new Error(
							`Failed to parse package.json file while searching for root, ${error}`,
						);
					}
				}) ?? targetDir;
		}
		return targetRoot;
	};

	return {
		ownDir,
		get ownRoot() {
			return getOwnRoot();
		},
		targetDir,
		get targetRoot() {
			return getTargetRoot();
		},
		resolveOwn: (...paths) => nodePath.resolve(ownDir, ...paths),
		resolveOwnRoot: (...paths) => nodePath.resolve(getOwnRoot(), ...paths),
		resolveTarget: (...paths) => nodePath.resolve(targetDir, ...paths),
		resolveTargetRoot: (...paths) => nodePath.resolve(getTargetRoot(), ...paths),
	};
}

/**
 * Checks if path is the same as or a child path of base.
 *
 * @public
 */
export function isChildPath(base: string, path: string): boolean {
	const relativePath = nodePath.relative(base, path);
	if (relativePath === '')
		return true;

	const outsideBase = relativePath.startsWith('..');
	const differentDrive = nodePath.isAbsolute(relativePath);

	return !outsideBase && !differentDrive;
}
