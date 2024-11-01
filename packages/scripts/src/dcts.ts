import { readFile, writeFile } from 'node:fs/promises';
import process from 'node:process';
import { green } from 'colorette';
import { join } from 'pathe';
import { findFilesRecursivelyStringEndsWith } from '../../node/src/lib/findFilesRecursively';

const INPUT_PATH = join(process.cwd(), 'dist/cjs/');

async function main(): Promise<void> {
	for await (const file of findFilesRecursivelyStringEndsWith(INPUT_PATH, '.d.cts'))
		await writeFile(file, (await readFile(file, 'utf-8')).split('\n').map(line =>
			line.startsWith('import') || line.startsWith('export')
				? line.replace(/('\.(?:\/lib)?(?:\/debounce)?\/[a-zA-Z]+\.)js(';?)/, '$1cjs$2')
				: line,
		).join('\n'));

	console.log(green(`✅ Fixed imports in .d.cts files in ${INPUT_PATH} to reference .cjs files`));
}

void main();
