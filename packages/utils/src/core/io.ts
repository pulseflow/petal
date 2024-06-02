import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'pathe';
import { filename } from 'pathe/utils';

export const dir = Symbol('@flowr/utils/io:is_dir');

const _stat = (path: string) => ({ stats: statSync(path), path });
const _ls = (path: string) => readdirSync(path).map(_stat);
type Files = Awaited<ReturnType<typeof _ls>>;

function _f(f: Files, type?: string) {
	return type
		? f.filter(l => l.stats.isFile())
			.filter(l => filename(l.path).endsWith(`.${type}`))
			.map(l => filename(l.path).slice(0, -(type.length + 1)))
		: f.filter(l => l.stats.isFile()).map(l => filename(l.path));
}

const _d = (f: Files) => f.filter(l => l.stats.isDirectory()).map(l => filename(l.path));
const _r = (path: string) => readFileSync(path, { encoding: 'utf-8' });
const _w = (path: string, contents: string) => writeFileSync(path, contents, { encoding: 'utf-8' });

export const is = (input: 'dir' | typeof dir | string) => (input === 'dir' || input === dir) ? _d : (f: Files) => _f(f, input);

export function io(cwd: string) {
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

	const w = <T extends (...args: any) => any>(f: T, path: string[], ...args: any[]): ReturnType<T> => f(r(path), ...args);
	const ls = (path: string[]) => w(_ls, path);
	const exist = (path: string) => existsSync(path);

	return {
		ls: (...path: string[]) => ls(path),
		ls_f: (filetype: string, ...path: string[]) => is(filetype)(ls(path)),
		ls_d: (...path: string[]) => is(dir)(ls(path)),
		read: (...path: string[]) => w(_r, path),
		write: (contents: string, ...path: string[]) => w(_w, path, contents),
		exist: (...path: string[]) => exist(r(path)),
	};
}

export const getCwd = (meta: ImportMeta, ...move: string[]) => join(meta.dirname ?? new URL('.', meta.url).pathname, ...move);

export const auto = (meta: ImportMeta) => io(getCwd(meta));
