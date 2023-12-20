import fs from 'node:fs/promises';
import process from 'node:process';
import type { Buffer } from 'node:buffer';
import stripAnsi from 'strip-ansi';
import { beforeAll, beforeEach } from 'vitest';
import { setStdout } from '../src/messages.js';

export function setup() {
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
}

function resetEmptyFixture() {
	return fs.rm(new URL('./fixtures/empty/tsconfig.json', import.meta.url));
}

async function resetNotEmptyFixture() {
	const packagePath = new URL(
		'./fixtures/not-empty/package.json',
		import.meta.url,
	);
	const tsconfigPath = new URL(
		'./fixtures/not-empty/tsconfig.json',
		import.meta.url,
	);
	const pkg = JSON.parse(
		await fs.readFile(packagePath, { encoding: 'utf-8' }),
	);
	const overridenPkg = Object.assign(pkg, {
		scripts: { build: 'petal build' },
	});

	return Promise.all([
		fs.writeFile(packagePath, JSON.stringify(overridenPkg, null, 2), {
			encoding: 'utf-8',
		}),
		fs.writeFile(tsconfigPath, '{}', { encoding: 'utf-8' }),
	]);
}

export function resetFixtures() {
	return Promise.allSettled([resetEmptyFixture(), resetNotEmptyFixture()]);
}
