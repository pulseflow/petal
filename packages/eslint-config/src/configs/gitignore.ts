import fs from 'node:fs';
import { findUpSync } from 'find-up';
// @ts-expect-error no types
import parse from 'parse-gitignore';
import type { OptionsGitignore, TypedFlatConfigItem } from '../types';

export async function gitignore(options: OptionsGitignore = {}): Promise<TypedFlatConfigItem[]> {
	// eslint-disable-next-line perfectionist/sort-objects -- root needs to be defined first
	const { root = false, strict = true, files = root ? ['.gitignore'] : [findUpSync('.gitignore')!] || [] } = options;
	const ignores: string[] = [];

	files.forEach((f) => {
		if (!fs.existsSync(f))
			if (strict)
				throw new Error(`.gitignore file was not found: ${f}`);
			else return;

		const readFile = fs.readFileSync(f, 'utf-8');
		parse(`${readFile}\n`).globs().forEach((g: any) => {
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
