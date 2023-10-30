import { posix, win32 } from 'node:path';
import { isChildPath } from './isChildPath.js';
import { __dirname } from '../index.js';

describe('isChildPath', () => {
	it('should check child posix paths', () => {
		jest.isolateModules(() => {
			jest.setMock('node:path', posix);

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

			jest.dontMock('node:path');
		});
	});

	it('should check child win32 paths', () => {
		jest.isolateModules(() => {
			jest.setMock('node:path', win32);

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

			jest.dontMock('node:path');
		});
	});
});
