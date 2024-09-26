import type { Stats } from 'node:fs';
import type { ArgsFn } from '../types';
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'pathe';
import { filename } from 'pathe/utils';

export const dir = Symbol('@flowr/utils/io:is_dir');

export interface File { stats: Stats; path: string }
const _stat = (path: string): File => ({ stats: statSync(path), path });

function _f(f: File[], type?: string): string[] {
	return type
		? f.filter(l => l.stats.isFile())
			.filter(l => filename(l.path).endsWith(`.${type}`))
			.map(l => filename(l.path).slice(0, -(type.length + 1)))
		: f.filter(l => l.stats.isFile())
			.map(l => filename(l.path));
}

const _d = (f: File[]): string[] => f.filter(l => l.stats.isDirectory()).map(l => filename(l.path));
const _r = (path: string): string => readFileSync(path, { encoding: 'utf-8' });
const _w = (path: string, contents: string): void => writeFileSync(path, contents, { encoding: 'utf-8' });

export const is = (input: 'dir' | typeof dir | string): ((f: File[]) => string[]) => (input === 'dir' || input === dir) ? _d : (f: File[]) => _f(f, input);

export interface IO {
	ls: (...path: string[]) => File[];
	ls_f: (filetype: string, ...path: string[]) => string[];
	ls_d: (...path: string[]) => string[];
	read: (...path: string[]) => string;
	write: (contents: string, ...path: string[]) => void;
	exists: (...path: string[]) => boolean;
}

export function io(cwd: string): IO {
	const r = (path: string[]): string => {
		const resolved = join(...path);
		if (resolved.startsWith('/'))
			return resolved;
		if (resolved.startsWith('.'))
			return join(cwd, resolved);
		if (resolved.includes('@'))
			return resolved.replace('@', cwd);
		return join(cwd, resolved);
	};

	const w = <T extends ArgsFn>(f: T, path: string[], ...args: any[]): ReturnType<T> => f(r(path), ...args);
	const ls = (path: string[]): File[] => w((path: string): File[] => readdirSync(path).map(_stat), path);

	return {
		ls: (...path: string[]) => ls(path),
		ls_f: (filetype: string, ...path: string[]) => is(filetype)(ls(path)),
		ls_d: (...path: string[]) => is(dir)(ls(path)),
		read: (...path: string[]) => w(_r, path),
		write: (contents: string, ...path: string[]) => w(_w, path, contents),
		exists: (...path: string[]) => existsSync(r(path)),
	};
}

export const getCwd = (meta: ImportMeta, ...move: string[]): string => join(meta.dirname ?? new URL('.', meta.url).pathname, ...move);
export const auto = (meta: ImportMeta): IO => io(getCwd(meta));
