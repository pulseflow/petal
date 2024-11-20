import type { OptionsGitignore, TypedFlatConfigItem } from '../types/index.ts';
import fs from 'node:fs';
import process from 'node:process';
import { convertIgnorePatternToMinimatch } from '@eslint/compat';
import { findUpSync } from 'find-up-simple';
import { dirname, relative, resolve } from 'pathe';
import { toArray } from '../utils.ts';

export async function gitignore(options: OptionsGitignore = {}): Promise<TypedFlatConfigItem[]> {
	const ignores: string[] = [];
	const cwd = options.cwd ?? process.cwd();
	const strict = options.strict ?? true;
	const root = options.root ?? false;
	const files = toArray(options.files ?? root ? ['.gitignore'] : findUpSync('.gitignore') || []);

	files.forEach((f) => {
		if (!fs.existsSync(f))
			if (strict)
				throw new Error(`.gitignore file was not found: ${f}`);
			else return;

		ignores.push(...fs.readFileSync(f, 'utf-8')
			.split(/\r?\n/u)
			.filter(l => l && !l.startsWith('#'))
			.map(l => convertIgnorePatternToMinimatch(l))
			.map(p => relativeMinimatch(p, relative(cwd, dirname(f)), cwd))
			.filter(m => m !== null),
		);
	});

	if (strict && files.length === 0)
		throw new Error('no .gitignore file found');

	return [{ ignores, name: 'petal/ignores/git' }];
}

function relativeMinimatch(pattern: string, relativePath: string, cwd: string): string | null {
	if (new Set(['', '.', '/']).has(relativePath))
		return pattern;

	const negated = pattern.startsWith('!') ? '!' : '';
	const minimatch = { cleanPattern: negated ? pattern.slice(1) : pattern };

	if (!relativePath.endsWith('/'))
		relativePath = `${relativePath}/`;

	const parent = relativePath.startsWith('..');

	if (!parent)
		return `${negated}${relativePath}${minimatch.cleanPattern}`;

	if (!relativePath.match(/^(?:\.\.\/)+$/))
		throw new Error('the ignored file location should be a parent or child directory.');

	if (minimatch.cleanPattern.startsWith('**'))
		return pattern;

	const parents = relative(resolve(cwd, relativePath), cwd).split(/[/\\]/);
	while (parents.length && minimatch.cleanPattern.startsWith(`${parents[0]}/`)) {
		minimatch.cleanPattern = minimatch.cleanPattern.slice(parents[0].length + 1);
		parents.shift();
	}

	if (minimatch.cleanPattern.startsWith('**') || parents.length === 0)
		return `${negated}${minimatch.cleanPattern}`;

	return null;
}
