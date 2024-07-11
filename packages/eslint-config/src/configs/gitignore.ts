import fs from 'node:fs';
import { findUpSync } from 'find-up';
// @ts-expect-error no types
import parse from 'parse-gitignore';
import type { OptionsGitignore, TypedFlatConfigItem } from '../types';

const GITIGNORE = '.gitignore' as const;

export async function gitignore(options: OptionsGitignore = {}): Promise<TypedFlatConfigItem[]> {
	const root = options.root ?? false;
	const _files = options.files ?? root ? GITIGNORE : findUpSync(GITIGNORE) || [];
	const strict = options.strict ?? true;
	const ignores: string[] = [];
	const files = Array.isArray(_files) ? _files : [_files];

	files.forEach((f) => {
		if (!fs.existsSync(f))
			if (strict)
				throw new Error(`.gitignore file was not found: ${f}`);
			else return;

		parse(`${fs.readFileSync(f, 'utf-8')}\n`).globs().forEach((g: any) => {
			if (g.type === 'ignore')
				ignores.push(...g.patterns);
			else if (g.type === 'unignore')
				ignores.push(...g.patterns.map((p: string) => `!${p}`));
		});
	});

	if (strict && files.length === 0)
		throw new Error('no .gitignore file found');

	return [
		{
			ignores,
			// todo
			// name: 'petal/ignores/git',
		},
	];
}
