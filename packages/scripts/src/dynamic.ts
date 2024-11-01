import console from 'node:console';
import { readFile, writeFile } from 'node:fs/promises';
import process from 'node:process';
import { bold, green, red } from 'colorette';
import { destr } from 'destr';
import { basename, resolve } from 'pathe';
import { findFilesRecursivelyRegex } from '../../node/src/lib/findFilesRecursively';

const PACKAGE_NAME = process.argv[2];
const CHECK_MODE = process.argv.includes('--check');
const SIDE_EFFECTS = ['./dist/iife/index.global.js'];
const INPUT_PATH = resolve(import.meta.dirname, `../../${PACKAGE_NAME}/dist/esm`);
const PACKAGE_PATH = resolve(import.meta.dirname, `../../${PACKAGE_NAME}/package.json`);

async function main() {
	for await (const file of findFilesRecursivelyRegex(INPUT_PATH, /chunk-[A-Z0-9]+\.js(?!\.map)/))
		SIDE_EFFECTS.unshift(`./dist/esm/${basename(file)}`);

	const packageJsonRaw = await readFile(PACKAGE_PATH, 'utf8');
	const packageJSON: object = destr(packageJsonRaw);
	const newPackageJSON = JSON.stringify({ ...packageJSON, SIDE_EFFECTS }, null, '\t');
	const oldPackageJSON = JSON.stringify(packageJSON, null, '\t');

	if (oldPackageJSON === newPackageJSON) {
		console.log(green(`✅ The package.json file for ${PACKAGE_NAME} is up to date!`));
		process.exit(0);
	}

	if (CHECK_MODE) {
		console.error(red(`The package.json file for ${PACKAGE_NAME} is not up to date! Run ${green(bold('pnpm build'))} to update it.`));
		process.exit(1);
	}

	await writeFile(PACKAGE_PATH, newPackageJSON);
	console.log(green(`✅ The package.json file for ${PACKAGE_NAME} is updated successfully!`));
}

void main();
