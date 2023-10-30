import { relative, isAbsolute } from 'node:path';

/**
 * Checks if path is the same as or a child path of base.
 *
 * @public
 */
export const isChildPath = (base: string, path: string): boolean => {
	const relativePath = relative(base, path);
	if (relativePath === '') return true;

	const outsideBase = relativePath.startsWith('..');
	const differentDrive = isAbsolute(relativePath);

	return !outsideBase && !differentDrive;
};
