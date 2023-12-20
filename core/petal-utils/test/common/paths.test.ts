import { resolve as resolvePath } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { __dirname } from '../../src/index.js';
import {
	findOwnDir,
	findOwnRootDir,
	findPaths,
	findRootPath,
} from '../../src/common/paths.js';

describe('paths', () => {
	it('findOwnDir and findOwnRootDir should find owns paths', () => {
		const dir = findOwnDir(__dirname);
		const root = findOwnRootDir(dir);

		expect(dir).toBe(resolvePath(__dirname, '../..'));
		expect(root).toBe(resolvePath(__dirname, '../../../..'));
	});

	it('findRootPath should find a root path', () => {
		expect(findRootPath(__dirname, () => true)).toBe(
			resolvePath(__dirname, '../..'),
		);

		expect(findRootPath(__dirname, () => false)).toBeUndefined();

		expect(
			findRootPath(__dirname, path => path !== resolvePath(__dirname, '../package.json')),
		).toBe(resolvePath(__dirname, '../..'));
	});

	it('findPaths should find package paths', () => {
		const dir = resolvePath(__dirname, '../..');
		const root = resolvePath(__dirname, '../../../..');

		vi.spyOn(process, 'cwd').mockReturnValue(dir);

		const paths = findPaths(__dirname);

		expect(paths.ownDir).toBe(dir);
		expect(paths.ownRoot).toBe(root);
		expect(paths.resolveOwn('./derp.txt')).toBe(
			resolvePath(dir, 'derp.txt'),
		);
		expect(paths.resolveOwnRoot('./derp.txt')).toBe(
			resolvePath(root, 'derp.txt'),
		);
		expect(paths.targetDir).toBe(dir);
		expect(paths.targetRoot).toBe(root);
		expect(paths.resolveTarget('./derp.txt')).toBe(
			resolvePath(dir, 'derp.txt'),
		);
		expect(paths.resolveTargetRoot('./derp.txt')).toBe(
			resolvePath(root, 'derp.txt'),
		);
	});
});
