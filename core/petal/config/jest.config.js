import path, { join } from 'node:path';
import crypto from 'node:crypto';
import process from 'node:process';
import { Buffer } from 'node:buffer';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import glob from 'glob';
import fs from 'fs-extra';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const loadJSON = path => JSON.parse(fs.readFileSync(join(__dirname, path)));
const packageJson = loadJSON('../package.json');
const version = packageJson.version;

const require = createRequire(import.meta.url);
const esModules = [
	'@astrojs/cli-kit',
	'jest-.*',
	'typescript',
	'@astrojs',
	'@astrojs*',
].join('|');

const envOptions = {
	oldTests: Boolean(process.env.PETAL_OLD_TESTS),
};

/** @type {(targetPath: string, extraConfig: import('ts-jest').JestConfigWithTsJest) => import('ts-jest').JestConfigWithTsJest} */
async function getProjectCofig(targetPath, extraConfig) {
	const configJsPath = path.resolve(targetPath, 'jest.config.js');
	const configTsPath = path.resolve(targetPath, 'jest.config.ts');
	if (await fs.pathExists(configJsPath))
		return require(configJsPath);
	else if (await fs.pathExists(configTsPath))
		return require(configTsPath);

	const pkgJsonConfigs = [];
	let closestPkgJson;
	let currentPath = targetPath;
	for (let i = 0; i < 100; i++) {
		const packagePath = path.resolve(currentPath, 'package.json');
		const exists = fs.pathExistsSync(packagePath);
		if (exists) {
			try {
				const data = fs.readJsonSync(packagePath);
				if (!closestPkgJson)
					closestPkgJson = data;

				if (data.jest)
					pkgJsonConfigs.unshift(data.jest);
			}
			catch (error) {
				throw new Error(
					`could not parse package.json file reading jest configs, ${error}`,
				);
			}
		}

		const newPath = path.dirname(currentPath);
		if (newPath === currentPath)
			break;

		currentPath = newPath;
	}

	/** @type {import('ts-jest').JestConfigWithTsJest} */
	const options = {
		...extraConfig,
		rootDir: path.resolve(targetPath, 'src'),
		moduleNameMapper: {
			'^(\\.{1,2}/.*)\\.js$': '$1',
		},
		extensionsToTreatAsEsm: ['.ts'],
		transform: {
			'\\.(mjs|cjs|js)$': [
				require.resolve('./jestSwcTransform.cjs'),
				{
					jsc: {
						parser: {
							syntax: 'ecmascript',
						},
					},
				},
			],
			'\\.jsx$': [
				require.resolve('./jestSwcTransform.cjs'),
				{
					jsc: {
						parser: {
							syntax: 'ecmascript',
							jsx: true,
						},
						transform: {
							react: {
								runtime: 'automatic',
							},
						},
					},
				},
			],
			'\\.ts$': [
				require.resolve('./jestSwcTransform.cjs'),
				{
					jsc: {
						parser: {
							syntax: 'typescript',
							ignoreDynamic: true,
						},
					},
				},
			],
			'\\.tsx$': [
				require.resolve('./jestSwcTransform.cjs'),
				{
					jsc: {
						parser: {
							syntax: 'typescript',
							tsx: true,
						},
						transform: {
							react: {
								runtime: 'automatic',
							},
						},
					},
				},
			],
			'\\.(yaml)$': require.resolve('./jestYamlTransform.cjs'),
		},
		testMatch: ['**/*.test.{js,jsx,ts,tsx,mjs,cjs}'],
		runtime: envOptions.oldTests
			? undefined
			: require.resolve('./jestCachingModuleLoader.cjs'),
		transformIgnorePatterns: [`/node_modules/(?:${esModules})/`],
		setupFiles: [path.join(__dirname, './jest.setup.js')],
	};

	options.setupFilesAfterEnv = options.setupFilesAfterEnv || [];
	if (fs.existsSync(path.resolve(targetPath, 'src/setupTests.ts')))
		options.setupFilesAfterEnv.push('<rootDir>/setupTests.ts');

	const config = Object.assign(options, ...pkgJsonConfigs);

	if (!config.id) {
		const configHash = crypto
			.createHash('md5')
			.update(version)
			.update(Buffer.alloc(1))
			.update(JSON.stringify(config.transform))
			.digest('hex');
		config.id = `petal_cli_${configHash}`;
	}

	return config;
}

/** @type {() => import('ts-jest').JestConfigWithTsJest} */
async function getRootConfig() {
	const targetPath = process.cwd();
	const targetPackagePath = path.resolve(targetPath, 'package.json');
	const exists = await fs.pathExists(targetPackagePath);

	const coverageConfig = {
		coverageDirectory: path.resolve(targetPath, 'coverage'),
		coverageProvider: envOptions.oldTests ? 'v8' : 'babel',
		collectCoverageFrom: ['**/*.{js,jsx,ts,tsx,mjs,cjs}', '!**/*.d.ts'],
	};

	if (!exists)
		return getProjectCofig(targetPath, coverageConfig);

	const data = await fs.readJson(targetPackagePath);
	const wsPatterns = data.workspaces && data.workspaces.packages;
	if (!wsPatterns)
		return getProjectCofig(targetPath, coverageConfig);

	const projectPaths = await Promise.all(
		wsPatterns.map(p => glob(path.join(targetPath, p))),
	).then(_ => _.flat());

	const configs = await Promise.all(
		projectPaths.flat().map(async (pp) => {
			const packagePath = path.resolve(pp, 'package.json');
			if (!(await fs.pathExists(packagePath)))
				return undefined;

			const pkgData = await fs.readJson(packagePath);
			const testScript = pkgData.scripts && pkgData.scripts.test;
			const isSupportedTestScript = testScript?.includes('petal test');
			if (testScript && isSupportedTestScript) {
				return await getProjectCofig(pp, {
					displayName: pkgData.name,
				});
			}

			return undefined;
		}),
	).then(cs => cs.filter(Boolean));

	return {
		rootDir: targetPath,
		projects: configs,
		...coverageConfig,
	};
}

export default getRootConfig();
