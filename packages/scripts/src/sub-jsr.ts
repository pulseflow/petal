import console from 'node:console';
import { readFile, writeFile } from 'node:fs/promises';
import process from 'node:process';
import { bold, green, red } from 'colorette';
import { destr } from 'destr';
import { basename, resolve } from 'pathe';
import { findFilesRecursivelyStringEndsWith } from '../../node/src/lib/findFilesRecursively';

const PACKAGE_NAME = process.argv[2];
const CHECK_MODE = process.argv.includes('--check');
const PACKAGE_PATH = resolve(import.meta.dirname, `../../${PACKAGE_NAME}/jsr.json`);
const EXPORT_MAP: Map<string, string> = new Map([['.', './src/index.ts']]);

async function main() {
	for await (const file of findFilesRecursivelyStringEndsWith(resolve(import.meta.dirname, `../../${PACKAGE_NAME}/src/lib`), '.ts')) {
		const name = basename(file).replace(/\.ts$/, '');
		const splitted = file.split('lib');
		splitted.shift();

		if (name === 'index')
			continue;
		if (name.startsWith('_'))
			continue;

		if (PACKAGE_NAME === 'utilities' && name === 'debounce')
			EXPORT_MAP.set(`./${name}`, `./src/lib/debounce/${name}.ts`);
		else if (PACKAGE_NAME === 'iterator' && name === 'comparators')
			EXPORT_MAP.set(`./${name}`, `./src/lib/shared/${name}.ts`);
		else
			EXPORT_MAP.set(`./${name}`, `./src/lib/${name}.ts`);
	}

	const publishObj = { include: ['LICENSE*', 'README.md', 'src'] };
	const exportObj = Object.fromEntries([...EXPORT_MAP.entries()].sort((a, b) => a[0].localeCompare(b[0])));
	const jsrJSON: object = destr(await readFile(PACKAGE_PATH, 'utf8'));
	const newJsrJSON = JSON.stringify({ ...jsrJSON, exports: exportObj, publish: publishObj }, null, '\t');
	const oldJsrJSON = JSON.stringify(jsrJSON, null, '\t');

	if (oldJsrJSON === newJsrJSON) {
		console.log(green(`The jsr.json file for ${PACKAGE_NAME} is up to date!`));
		process.exit(0);
	}

	if (CHECK_MODE) {
		console.error(red(`The jsr.json file for ${PACKAGE_NAME} is not up to date! Run ${green(bold('pnpm build'))} to update it.`));
		process.exit(1);
	}

	await writeFile(PACKAGE_PATH, newJsrJSON);
	console.log(green(`The jsr.json file for ${PACKAGE_NAME} is updated successfully!`));
}

void main();
