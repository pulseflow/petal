import { rename } from 'node:fs/promises';
import process from 'node:process';
import { bold, green } from 'colorette';
import { join } from 'pathe';
import { findFilesRecursivelyStringEndsWith } from '../../node/src/lib/findFilesRecursively';

const INPUT_PATH = join(process.cwd(), 'dist/cjs/');

async function main() {
	for await (const file of findFilesRecursivelyStringEndsWith(INPUT_PATH, '.d.ts'))
		await rename(file, file.replace(/\.d\.ts$/, '.d.cts'));

	console.log(green(`✅ Renamed .d.ts files in ${bold(INPUT_PATH)} to .d.cts`));
}

void main();
