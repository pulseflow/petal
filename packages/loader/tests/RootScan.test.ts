import type { MockInstance } from 'vitest';
import { fileURLToPath } from 'node:url';
import { resolve } from 'pathe';
import { parseRootData, type RootData } from '../src/lib/utils.ts';

let cwd: MockInstance<typeof process.cwd>;

const fixturesDir = fileURLToPath(new URL('fixtures', import.meta.url));

/**
 * Joins the given path segments with 'tests/fixtures' and returns the resulting path.
 *
 * @param path - The path segments to join.
 * @returns The joined path.
 */
const testsFixturesJoin = (...path: string[]) => resolve(fixturesDir, ...path);

/**
 * Mocks the current working directory by setting the return value of `process.cwd()` to the joined path of the provided arguments.
 *
 * @param pathForCwd - The path segments to join and set as the current working directory.
 */
function mockCwd(...pathForCwd: string[]) {
	cwd = vi.spyOn(process, 'cwd').mockReturnValue(testsFixturesJoin(...pathForCwd));
}

/**
 * Asserts that the actual RootData object is equal to the expected RootData object.
 * @param actual - The actual RootData object.
 * @param type - The type of the RootData object ('ESM' or 'CommonJS').
 * @param rootPath - The root path of the RootData object.
 */
const expectRootDataToEqual = (actual: RootData, type: 'ESM' | 'CommonJS', ...rootPath: string[]) => expect(actual).toStrictEqual<RootData>({ root: testsFixturesJoin(...rootPath), type });

afterEach(() => {
	expect(cwd).toHaveBeenCalled();
	cwd.mockRestore();
});

describe('rootScan', () => {
	describe('type=commonjs', () => {
		const commonJsBasePath = 'commonjs';

		it('given type=commonjs && main property then returns correct root', () => {
			mockCwd(commonJsBasePath, 'main');

			const rootData = parseRootData();
			expectRootDataToEqual(rootData, 'CommonJS', commonJsBasePath, 'main', 'dist', 'lib');
		});

		it('given type=commonjs && module property then returns correct root', () => {
			mockCwd(commonJsBasePath, 'module');

			const rootData = parseRootData();
			expectRootDataToEqual(rootData, 'CommonJS', commonJsBasePath, 'module', 'dist', 'lib');
		});
	});

	describe('type=module', () => {
		const moduleBasePath = 'module';

		it('given type=module && main property then returns correct root', () => {
			mockCwd(moduleBasePath, 'main');

			const rootData = parseRootData();
			expectRootDataToEqual(rootData, 'ESM', moduleBasePath, 'main', 'dist', 'lib');
		});

		it('given type=module && module property then returns correct root', () => {
			mockCwd(moduleBasePath, 'module');

			const rootData = parseRootData();
			expectRootDataToEqual(rootData, 'ESM', moduleBasePath, 'module', 'dist', 'lib');
		});
	});

	describe('no-package', () => {
		const noPackageBasePath = 'no-package';

		it('given no package.json then returns correct root', () => {
			mockCwd(noPackageBasePath);

			const rootData = parseRootData();

			expect(rootData).toStrictEqual<RootData>({
				root: testsFixturesJoin(noPackageBasePath),
				type: 'CommonJS',
			});
		});
	});

	describe('type=undefined', () => {
		const noTypeBasePath = 'no-type';

		it('given type=undefined && main property then returns correct root', () => {
			mockCwd(noTypeBasePath, 'main');

			const rootData = parseRootData();
			expectRootDataToEqual(rootData, 'CommonJS', noTypeBasePath, 'main', 'dist', 'lib');
		});

		it('given type=undefined && module property then returns correct root', () => {
			mockCwd(noTypeBasePath, 'module');

			const rootData = parseRootData();
			expectRootDataToEqual(rootData, 'ESM', noTypeBasePath, 'module', 'dist', 'lib');
		});
	});
});
