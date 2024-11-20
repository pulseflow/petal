import console from 'node:console';
import { readFile, writeFile } from 'node:fs/promises';
import process from 'node:process';
import { bold, green, red, yellow } from 'colorette';
import { destr } from 'destr';
import { basename, resolve } from 'pathe';
import { findFilesRecursivelyStringEndsWith } from '../../node/src/lib/findFilesRecursively';

interface ExportEntry {
	types: string;
	default: string;
}

interface Export {
	import: ExportEntry;
	require: ExportEntry;
	browser?: string;
}

interface ExportTypes {
	types: string;
}

const PACKAGE_NAME = process.argv[2];
const CHECK_MODE = process.argv.includes('--check');
const TYPES_MODE = PACKAGE_NAME === 'types';
const PACKAGE_PATH = resolve(import.meta.dirname, `../../${PACKAGE_NAME}/package.json`);
const EXPORT_MAP: Map<string, Export | ExportTypes | string> = new Map();

async function main() {
	if (!TYPES_MODE)
		EXPORT_MAP.set('.', {
			import: {
				types: './dist/esm/index.d.ts',
				default: './dist/esm/index.js',
			},
			require: {
				types: './dist/cjs/index.d.cts',
				default: './dist/cjs/index.cjs',
			},
			browser: './dist/iife/index.global.js',
		});
	else
		EXPORT_MAP.set('.', {
			types: './src/index.ts',
		});

	for await (const file of findFilesRecursivelyStringEndsWith(resolve(import.meta.dirname, `../../${PACKAGE_NAME}/src/lib`), '.ts')) {
		const name = basename(file).replace(/\.ts$/, '');

		if (name === 'index')
			continue;
		if (name.startsWith('_'))
			continue;

		if (PACKAGE_NAME === 'utilities' && name === 'debounce')
			EXPORT_MAP.set(`./${name}`, {
				import: {
					types: `./dist/esm/lib/debounce/${name}.d.ts`,
					default: `./dist/esm/lib/debounce/${name}.js`,
				},
				require: {
					types: `./dist/cjs/lib/debounce/${name}.d.cts`,
					default: `./dist/cjs/lib/debounce/${name}.cjs`,
				},
			});
		else if (PACKAGE_NAME === 'iterator' && name === 'comparators')
			EXPORT_MAP.set(`./${name}`, {
				import: {
					types: `./dist/esm/lib/shared/${name}.d.ts`,
					default: `./dist/esm/lib/shared/${name}.js`,
				},
				require: {
					types: `./dist/cjs/lib/shared/${name}.d.cts`,
					default: `./dist/cjs/lib/shared/${name}.cjs`,
				},
			});
		else if (TYPES_MODE)
			EXPORT_MAP.set(`./${name.charAt(0).toLowerCase() + name.slice(1)}`, {
				types: `./src/lib/${name}.ts`,
			});
		else
			EXPORT_MAP.set(`./${name}`, {
				import: {
					types: `./dist/esm/lib/${name}.d.ts`,
					default: `./dist/esm/lib/${name}.js`,
				},
				require: {
					types: `./dist/cjs/lib/${name}.d.cts`,
					default: `./dist/cjs/lib/${name}.cjs`,
				},
			});
	}

	EXPORT_MAP.set('./package.json', './package.json');
	const exportObj = Object.fromEntries([...EXPORT_MAP.entries()].sort((a, b) => a[0].localeCompare(b[0])));
	const packageJSON: object = destr(await readFile(PACKAGE_PATH, 'utf8'));
	const newPackageJSON = `${JSON.stringify({ ...packageJSON, exports: exportObj }, null, '\t')}\n`;
	const oldPackageJSON = JSON.stringify(packageJSON, null, '\t');

	if (oldPackageJSON === newPackageJSON) {
		console.log(green(`The package.json file for ${bold(PACKAGE_NAME)} is up to date!`));
		process.exit(0);
	}

	if (CHECK_MODE) {
		console.error(red(`The package.json file for ${bold(PACKAGE_NAME)} is not up to date! Run ${yellow(bold('pnpm build'))} to update it.`));
		process.exit(1);
	}

	await writeFile(PACKAGE_PATH, newPackageJSON);
	console.log(green(`The package.json file for ${bold(PACKAGE_NAME)} is updated successfully!`));
}

void main();
