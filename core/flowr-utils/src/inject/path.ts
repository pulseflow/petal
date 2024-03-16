import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export const dir = Symbol('petal:io:is_dir');

const _ls = (path: string) => readdirSync(path, { withFileTypes: true, encoding: 'utf-8' });
type Files = Awaited<ReturnType<typeof _ls>>;

function _f(f: Files, type?: string) {
	const files = f.filter(fi => fi.isFile());
	if (!type)
		return files.map(fi => fi.name);

	return files
		.filter(fi => fi.name.endsWith(`.${type}`))
		.map(fi => fi.name.slice(0, -(type.length + 1)));
}

function _d(f: Files) {
	return f.filter(fi => fi.isDirectory()).map(fi => fi.name);
}

export function is(input: 'dir' | typeof dir | string) {
	if (input === 'dir' || input === dir)
		return _d;

	return (f: Files) => _f(f, input);
}

export function io(cwd: string) {
	const r = (path: string[]): string => {
		const res = join(...path);
		if (res.startsWith('/'))
			return res;
		if (res.startsWith('.'))
			return join(cwd, res);
		if (res.includes('@'))
			return res.replace('@', cwd);
		return join(cwd, res);
	};

	function w<T extends (...args: any) => any, B extends boolean>(
		f: T,
		path: string[],
		shouldReturn: B,
		...args: any[]
	): B extends true ? string : ReturnType<T>;

	function w<T extends (...args: any) => any>(
		f: T,
		path: string[],
		shouldReturn: boolean,
		...args: any[]
	): string | ReturnType<T> {
		const res = f(r(path), ...args);

		if (shouldReturn)
			return r(path);
		else return res;
	}

	const ls = (path: string[]) => w(_ls, path, false);

	const exist = (path: string) => existsSync(path);

	return {
		ls: (...path: string[]) => ls(path),
		ls_f: (type: string, ...path: string[]) => is(type)(ls(path)),
		ls_d: (...path: string[]) => is(dir)(ls(path)),
		read: (...path: string[]) =>
			w(readFileSync, path, false, { encoding: 'utf-8' }),
		write: (contents: string, ...path: string[]) =>
			w(writeFileSync, path, true, contents, { encoding: 'utf-8' }),
		mkdir: (...path: string[]) =>
			w(mkdirSync, path, true, { recursive: true }),
		exist: (...path: string[]) => exist(r(path)),
	};
}

interface Meta {
	url: string;
	dirname?: string;
}

export function get_cwd(meta: Meta, ...move: string[]) {
	const cwd = meta.dirname ?? new URL('.', meta.url).pathname;
	return join(cwd, ...move);
}
