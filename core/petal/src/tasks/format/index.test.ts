import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { temporaryDirectory } from 'tempy';
import {
	mkdir as mkdirFS,
	readFile as readFileFS,
	writeFile as writeFileFS,
} from 'node:fs';

import { formatTask } from './index.js';

const writeFile = promisify(writeFileFS);
const readFile = promisify(readFileFS);
const mkdir = promisify(mkdirFS);

// @ts-ignore
jest.spyOn(process, 'exit').mockImplementation(c => c);

const __dirname = fileURLToPath(new URL('.', import.meta.url));

describe('petal format', () => {
	let pkgRoot: string;
	let testFile: string;

	beforeEach(async () => {
		jest.clearAllMocks();
		pkgRoot = temporaryDirectory();

		const fixtureFile = join(
			__dirname,
			'__fixtures__',
			'poorly-formatted-file.ts',
		);
		testFile = join(pkgRoot, 'src', 'poorly-formatted-file.ts');

		await mkdir(join(pkgRoot, 'src'));
		const content = (await readFile(fixtureFile)).toString();
		await writeFile(
			testFile,
			content.replace(/\/\/ prettier-ignore[\n]+/, ''),
		);
	});

	afterAll(() => jest.restoreAllMocks());

	it('formats files', async () => {
		const before = await readFile(
			join(pkgRoot, 'src', 'poorly-formatted-file.ts'),
		);
		expect(before.toString().trim()).toBe('export const FOO = "bar"');

		formatTask({ name: 'format', path: pkgRoot, restOptions: [] });

		const after = await readFile(
			join(pkgRoot, 'src', 'poorly-formatted-file.ts'),
		);
		expect(after.toString().trim()).toBe("export const FOO = 'bar';");
	});
});
