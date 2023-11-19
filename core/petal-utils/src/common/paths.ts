import fs from 'node:fs';
import process from 'node:process';
import { dirname, resolve as resolvePath } from 'node:path';

/**
 * A function that takes a set of path fragments and resolves them into a
 * single complete path, relative to some root.
 *
 * @public
 */
export type ResolveFunc = (...paths: string[]) => string;

/**
 * Common paths and resolve functions used by the cli.
 * Currently assumes it is being executed within a monorepo.
 *
 * @public
 */
export type Paths = {
	// Root dir of the cli itself, containing package.json
	ownDir: string;

	// Monorepo root dir of the cli itself. Only accessible when running inside the Petal repo.
	ownRoot: string;

	// The location of the app that the cli is being executed in
	targetDir: string;

	// The monorepo root package of the app that the cli is being executed in.
	targetRoot: string;

	// Resolve a path relative to own repo
	resolveOwn: ResolveFunc;

	// Resolve a path relative to own monorepo root. Only accessible when running inside the Petal repo.
	resolveOwnRoot: ResolveFunc;

	// Resolve a path relative to the app
	resolveTarget: ResolveFunc;

	// Resolve a path relative to the app repo root
	resolveTargetRoot: ResolveFunc;
};

// Looks for a package.json with a workspace config to identify the root of the monorepo
export const findRootPath = (
	searchDir: string,
	filterFunc: (pkgJsonPath: string) => boolean,
): string | undefined => {
	let path = searchDir;

	for (let i = 0; i < 1000; i++) {
		const packagePath = resolvePath(path, 'package.json');
		const exists = fs.existsSync(packagePath);
		if (exists && filterFunc(packagePath)) {
			return path;
		}

		const newPath = dirname(path);
		if (newPath === path) {
			return undefined;
		}
		path = newPath;
	}

	throw new Error(
		`Iteration limit reached when searching for root package.json at ${searchDir}`,
	);
};

export const findOwnDir = (searchDir: string) => {
	const path = findRootPath(searchDir, () => true);
	if (!path) {
		throw new Error(
			`No package.json found while searching for package root of ${searchDir}`,
		);
	}
	return path;
};

export const findOwnRootDir = (ownDir: string) => {
	const isLocal = fs.existsSync(resolvePath(ownDir, 'src'));
	if (!isLocal) {
		throw new Error(
			'Tried to access monorepo package root dir outside of Petal repository',
		);
	}

	return resolvePath(ownDir, '../..');
};

/**
 * Find paths related to a package and its execution context.
 *
 * @public
 * @example
 *
 * const paths = findPaths(__dirname)
 */
export const findPaths = (searchDir: string): Paths => {
	const ownDir = findOwnDir(searchDir);
	const targetDir = fs
		.realpathSync(process.cwd())
		.replace(/^[a-z]:/, str => str.toLocaleUpperCase('en-US'));

	let ownRoot = '';
	const getOwnRoot = () => {
		if (!ownRoot) {
			ownRoot = findOwnRootDir(ownDir);
		}
		return ownRoot;
	};

	let targetRoot = '';
	const getTargetRoot = () => {
		if (!targetRoot) {
			targetRoot =
				findRootPath(targetDir, path => {
					try {
						const content = fs.readFileSync(path, 'utf8');
						const data = JSON.parse(content);
						return Boolean(data.workspaces?.packages);
					} catch (error) {
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
		resolveOwn: (...paths) => resolvePath(ownDir, ...paths),
		resolveOwnRoot: (...paths) => resolvePath(getOwnRoot(), ...paths),
		resolveTarget: (...paths) => resolvePath(targetDir, ...paths),
		resolveTargetRoot: (...paths) => resolvePath(getTargetRoot(), ...paths),
	};
};

/**
 * The name of the Petals's config file
 *
 * @public
 */
export const PETAL_JSON = 'petal.json';
