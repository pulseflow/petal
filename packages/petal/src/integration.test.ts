import { exec as execCP } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import {
	writeFile as writeFileFS,
	mkdir as mkdirFS,
	copyFile as copyFileFS,
	existsSync,
} from 'node:fs';
import fromEntries from 'object.fromentries';
import * as tempy from 'tempy';
import { default as Debug } from 'debug';
import { rimrafSync } from 'rimraf';

import { THIS_ROOT, TSCONFIG } from './paths.js';

const dbg = Debug('petal:integration-test'); // eslint-disable-line new-cap
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = join(__dirname, '..');
const CLI = join(root, 'build/index.js');
const MONOREPO_ROOT = join(root, '../..');
const ESLINT_ROOT = join(MONOREPO_ROOT, 'packages/eslint-config');

const execPromise = promisify(execCP);
const writeFile = promisify(writeFileFS);
const mkdir = promisify(mkdirFS);
const copyFile = promisify(copyFileFS);

// log output after the command finishes
const exec = async (cmd: string, options?: object) => {
	function _log(resp: { stdout?: string | Buffer; stderr?: string | Buffer }) {
		if (resp.stdout) resp.stdout.toString().split('\n').forEach(dbg);
		if (resp.stderr) resp.stderr.toString().split('\n').forEach(dbg);
	}
	try {
		const resp = await execPromise(cmd, options);
		_log(resp);
		return resp;
	} catch (err) {
		_log(err as any);
		throw err;
	}
};

const SETUP_REPO_TIMEOUT = 30000;
const TEST_SCRIPTS_TIMEOUT = 60000;

// eslint-disable-next-line jest/no-disabled-tests
describe.skip('integration tests', () => {
	let PKG_ROOT: string;

	beforeEach(() => {
		PKG_ROOT = tempy.temporaryDirectory();
	});

	describe('help', () => {
		const USAGE_MATCH = 'Usage: petal [options] [command]';

		test('The CLI fails and offers help when invoked with no arguments', async () => {
			await expect(exec(`${CLI}`)).rejects.toMatchObject({
				stdout: expect.stringContaining(USAGE_MATCH),
			});
		});

		test('The CLI offers help when invoked with --help flag', async () => {
			const result = await exec(`${CLI} --help`);
			expect(result.stdout).toMatch(USAGE_MATCH);
		});
	});

	describe('TypeScript', () => {
		beforeEach(async () => {
			await setupRepo(
				'index.ts',
				'index.test.ts',
				'Component.tsx',
				'Component.test.tsx',
			);
		}, SETUP_REPO_TIMEOUT);

		// eslint-disable-next-line jest/expect-expect
		test(
			'Full integration test',
			async () => await testScripts(),
			TEST_SCRIPTS_TIMEOUT,
		);
	});

	describe('JavaScript', () => {
		beforeEach(async () => {
			await setupRepo(
				'index.js',
				'index.test.js',
				'Component.jsx',
				'Component.test.jsx',
			);
		}, SETUP_REPO_TIMEOUT);

		// eslint-disable-next-line jest/expect-expect
		test(
			'Full integration test',
			async () => await testScripts(['--no-types'], ['--no-typecheck']),
			TEST_SCRIPTS_TIMEOUT,
		);
	});

	async function setupRepo(...fileNames: string[]) {
		const localDependencies: string[] = [
			'eslint',
			'ts-jest',
			'typescript',
			'@types/jest',
			'@types/react',
		];

		// as of ESLint 6, ESLint plugins need to be locally installed too.
		const eslintDependencies: string[] = [
			'@typescript-eslint/eslint-plugin',
			'eslint-plugin-jest',
			'eslint-plugin-jsx-a11y',
			'eslint-plugin-react',
			'eslint-plugin-react-hooks',
		];

		const pkg = {
			name: 'test-pkg',
			scripts: {
				test: `${CLI} test`,
				build: `${CLI} build`,
				lint: `${CLI} lint`,
				commit: `${CLI} commit`,
				release: `${CLI} release`,
			},
			dependencies: fromEntries([
				...Object.entries(
					(await import(`${THIS_ROOT}/package.json`)).dependencies,
				).filter(([k]) => localDependencies.includes(k)),
				...Object.entries(
					(await import(`${ESLINT_ROOT}/package.json`)).dependencies,
				).filter(([k]) => eslintDependencies.includes(k)),
				['react', '^17'],
			]),
		};

		const tsConfig = {
			extends: TSCONFIG,
			include: ['src'],
		};

		await writeFile(
			join(PKG_ROOT, 'package.json'),
			JSON.stringify(pkg, null, '  '),
		);

		await writeFile(
			join(PKG_ROOT, 'tsconfig.json'),
			JSON.stringify(tsConfig, null, 2),
		);

		await mkdir(join(PKG_ROOT, 'src'));
		fileNames.map(fileName =>
			copyFile(
				join(THIS_ROOT, '__fixtures__', fileName),
				join(PKG_ROOT, 'src', fileName),
			),
		);
		await copyFile(
			join(MONOREPO_ROOT, '.gitignore'),
			join(PKG_ROOT, '.gitignore'),
		);

		await exec('pnpm i', { cwd: PKG_ROOT });
		// Required for the `commit` and `commitmsg` tasks.
		await exec('git init', { cwd: PKG_ROOT });
	}

	async function testScripts(
		buildArgs: string[] = [],
		lintArgs: string[] = ['--ignore-path=.gitignore', '--format=checkstyle'],
	) {
		try {
			rimrafSync(join(PKG_ROOT, 'build'));
			expect(existsSync(join(PKG_ROOT, 'build/index.js'))).toBe(false);
			await exec(['pnpm build', ...buildArgs].join(' '), { cwd: PKG_ROOT });
			expect(existsSync(join(PKG_ROOT, 'build/index.js'))).toBe(true);

			await exec('pnpm test', { cwd: PKG_ROOT });
			await exec('pnpm test index.test', { cwd: PKG_ROOT });
			await exec(['pnpm lint', ...lintArgs].join(' '), { cwd: PKG_ROOT });
		} catch (e) {
			console.log((e as any).stdout); // eslint-disable-line no-console
			throw e;
		}
	}
});
