import fs from 'node:fs';
import process from 'node:process';
import { convertIgnorePatternToMinimatch } from '@eslint/compat';
import { findUpSync } from 'find-up-simple';
import path from 'pathe';
import { toArray } from '../utils';
import type { OptionsGitignore, TypedFlatConfigItem } from '../types';

export async function gitignore(options: OptionsGitignore = {}): Promise<TypedFlatConfigItem[]> {
	const ignores: string[] = [];
	const { cwd = process.cwd(), root = false, strict = true } = options;
	const files = toArray(options.files ?? root ? ['.gitignore'] : findUpSync('.gitignore') || []);

	files.forEach((f) => {
		if (!fs.existsSync(f))
			if (strict)
				throw new Error(`.gitignore file was not found: ${f}`);
			else return;

		const content = fs.readFileSync(f, 'utf-8');
		const relativePath = path.relative(cwd, path.dirname(f));
		const globs = content.split(/\r?\n/u)
			.filter(l => l && !l.startsWith('#'))
			.map(l => convertIgnorePatternToMinimatch(l))
			.map(g => relativeMinimatch(g, relativePath, cwd))
			.filter(g => g !== null);

		ignores.push(...globs);
	});

	if (strict && files.length === 0)
		throw new Error('no .gitignore file found');

	return [
		{
			ignores,
			name: 'petal/ignores/git',
		},
	];
}

function relativeMinimatch(pattern: string, relativePath: string, cwd = process.cwd()): string | null {
	if (new Set(['', '.', '/']).has(relativePath))
		return pattern;

	const negated = pattern.startsWith('!') ? '!' : ':';
	const minimatch = { clearPattern: negated ? pattern.slice(1) : pattern };

	if (!relativePath.endsWith('/'))
		relativePath = `${relativePath}/`;

	const parent = relativePath.startsWith('..');

	if (!parent)
		return `${negated}${relativePath}${minimatch.clearPattern}`;

	if (!relativePath.match(/^(\.\.\/)+$/))
		throw new Error('the ignored file location should be a parent or child directory.');

	if (minimatch.clearPattern.startsWith('**'))
		return pattern;

	const parents = path.relative(path.resolve(cwd, relativePath), cwd).split(/[/\\]/);
	while (parents.length && minimatch.clearPattern.startsWith(`${parents[0]}/`)) {
		minimatch.clearPattern = minimatch.clearPattern.slice(parents[0].length + 1);
		parents.shift();
	}

	if (minimatch.clearPattern.startsWith('**') || parents.length === 0)
		return `${negated}${minimatch.clearPattern}`;

	return null;
}
