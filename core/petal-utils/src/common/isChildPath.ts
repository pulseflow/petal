import { isAbsolute, relative } from 'node:path';

/**
 * Checks if path is the same as or a child path of base.
 *
 * @public
 */
export function isChildPath(base: string, path: string): boolean {
	const relativePath = relative(base, path);
	if (relativePath === '')
		return true;

	const outsideBase = relativePath.startsWith('..');
	const differentDrive = isAbsolute(relativePath);

	return !outsideBase && !differentDrive;
}
