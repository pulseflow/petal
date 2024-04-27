import { afterEach, describe, expect, it, vi } from 'vitest';
import { isChildPath } from '../../src/index';

describe('isChildPath', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should check child posix paths', () => {
		vi.mock('node:path', async (importer) => {
			const origin = await importer<typeof import('node:path')>();

			return {
				...origin,
				isAbsolute: origin.posix.isAbsolute,
				relative: origin.posix.relative,
			};
		});

		expect(isChildPath('/', '/')).toBe(true);
		expect(isChildPath('/x', '/x')).toBe(true);
		expect(isChildPath('/x', '/x/y')).toBe(true);
		expect(isChildPath('/x', '/x/x')).toBe(true);
		expect(isChildPath('/x', '/x/y/z')).toBe(true);
		expect(isChildPath('/x/y', '/x/y/z')).toBe(true);
		expect(isChildPath('/x/y/z', '/x/y/z')).toBe(true);
		expect(isChildPath('/x/a b c/z', '/x/a b c/z')).toBe(true);
		expect(isChildPath('/', '/ yz')).toBe(true);

		expect(isChildPath('/x', '/y')).toBe(false);
		expect(isChildPath('/x', '/')).toBe(false);
		expect(isChildPath('/x', '/x y')).toBe(false);
		expect(isChildPath('/x y', '/x yz')).toBe(false);
		expect(isChildPath('/ yz', '/')).toBe(false);
		expect(isChildPath('/x', '/')).toBe(false);
	});

	it('should check child win32 paths', () => {
		vi.mock('node:path', async (importer) => {
			const origin = await importer<typeof import('node:path')>();

			return {
				...origin,
				isAbsolute: origin.win32.isAbsolute,
				relative: origin.win32.relative,
			};
		});

		expect(isChildPath('/x', '/x')).toBe(true);
		expect(isChildPath('/x', '/x/y')).toBe(true);
		expect(isChildPath('/x', '/x/x')).toBe(true);
		expect(isChildPath('/x', '/x/y/z')).toBe(true);
		expect(isChildPath('/x/y', '/x/y/z')).toBe(true);
		expect(isChildPath('/x/y/z', '/x/y/z')).toBe(true);
		expect(isChildPath('Z:', 'Z:')).toBe(true);
		expect(isChildPath('C:/', 'c:/')).toBe(false);
		expect(isChildPath('C:/x', 'C:/x')).toBe(true);
		expect(isChildPath('C:/x', 'c:/x')).toBe(false);
		expect(isChildPath('C:/x', 'C:/x/y')).toBe(true);
		expect(isChildPath('d:/x', 'D:/x/y')).toBe(false);

		expect(isChildPath('/x', '/y')).toBe(false);
		expect(isChildPath('/x', '/')).toBe(false);
		expect(isChildPath('C:/', 'D:/')).toBe(false);
		expect(isChildPath('C:/x', 'D:/x')).toBe(false);
		expect(isChildPath('D:/x', 'CD:/x')).toBe(false);
		expect(isChildPath('D:/x', 'D:/y')).toBe(false);
	});
});
