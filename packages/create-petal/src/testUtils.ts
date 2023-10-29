import fs from 'node:fs/promises';
import { setStdout } from './messages.js';
import stripAnsi from 'strip-ansi';

export const setup = () => {
	const ctx = { messages: new Array<string>() };
	beforeAll(() => {
		setStdout(
			Object.assign({}, process.stdout, {
				write: (buf: Buffer) => {
					ctx.messages.push(stripAnsi(String(buf)).trim());
					return true;
				},
			}),
		);
	});

	beforeEach(() => {
		ctx.messages = [];
	});

	return {
		messages: () => ctx.messages,
		length: () => ctx.messages.length,
		hasMessage: (content: string) =>
			!!ctx.messages.find(msg => msg.includes(content)),
	};
};

const resetEmptyFixture = () =>
	fs.rm(new URL('../__fixtures__/empty/tsconfig.json', import.meta.url));

const resetNotEmptyFixture = async () => {
	const packagePath = new URL(
		'../__fixtures__/not-empty/package.json',
		import.meta.url,
	);
	const tsconfigPath = new URL(
		'../__fixtures__/not-empty/tsconfig.json',
		import.meta.url,
	);
	const pkg = JSON.parse(await fs.readFile(packagePath, { encoding: 'utf-8' }));
	const overridenPkg = Object.assign(pkg, {
		scripts: { build: 'petal build' },
	});

	return Promise.all([
		fs.writeFile(packagePath, JSON.stringify(overridenPkg, null, 2), {
			encoding: 'utf-8',
		}),
		fs.writeFile(tsconfigPath, '{}', { encoding: 'utf-8' }),
	]);
};

export const resetFixtures = () =>
	Promise.allSettled([resetEmptyFixture(), resetNotEmptyFixture()]);
