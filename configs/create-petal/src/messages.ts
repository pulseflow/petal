/* eslint-disable no-async-promise-executor */
import { exec } from 'node:child_process';
import process from 'node:process';
import { color, label, spinner as load } from '@astrojs/cli-kit';
import { align, sleep } from '@astrojs/cli-kit/utils';
import stripAnsi from 'strip-ansi';
import { shell } from './shell.js';
import { say as flower } from './utils/say.js';

/**
 * Users may lack access to the global npm registry, so this function
 * checks the user's project type and will return an available registry.
 */
async function getRegistry(packageManager: string): Promise<string> {
	try {
		const { stdout } = await shell(packageManager, [
			'config',
			'get',
			'registry',
		]);
		return (
			stdout?.trim()?.replace(/\/$/, '') || 'https://registry.npmjs.org'
		);
	}
	catch (err) {
		return 'https://registry.npmjs.org';
	}
}

let stdout = process.stdout;
/**
 * @internal
 */
export function setStdout(writable: typeof process.stdout) {
	stdout = writable;
}

export async function say(messages: string | string[], { clear = false, hat = '' } = {}) {
	return flower(messages, { clear, hat, stdout });
}

export async function spinner(args: {
	start: string
	end: string
	while: (...args: any) => Promise<any>
}) {
	await load(args, { stdout });
}

export const title = (text: string) => `${align(label(text), 'end', 7)} `;

export const welcome = [
	`hewo! get ready to plant some flowers or smth`,
	`henwo~ let's scare the inter webs`,
	`meow`,
];

export function getName() {
	return new Promise<string>((resolve) => {
		exec('git config user.name', { encoding: 'utf-8' }, (_1, gitName) => {
			if (gitName.trim())
				return resolve(gitName.split(' ')[0].trim());
			exec('whoami', { encoding: 'utf-8' }, (_3, whoami) => {
				if (whoami.trim())
					return resolve(whoami.split(' ')[0].trim());
				return resolve('planter');
			});
		});
	});
}

let v: string;
export function getVersion(packageManager: string) {
	return new Promise<string>(async (resolve) => {
		if (v)
			return resolve(v);
		const registry = await getRegistry(packageManager);

		const { version } = await fetch(`${registry}/@flowr/petal/latest`, {
			redirect: 'follow',
		}).then(
			res => res.json(),
			() => ({ version: '' }),
		);

		v = version;
		resolve(version);
	});
}

export const log = (message: string) => stdout.write(`${message}\n`);

export function banner() {
	return log(
		`${label(`petal`, color.bgMagenta, color.black)}  ${color.bold(
			`initializing...`,
		)}`,
	);
}

export function bannerAbort() {
	return log(
		`\n${label(`petal`, color.bgRed, color.black)} ${color.bold(
			'aborting...',
		)}`,
	);
}

export async function info(prefix: string, text: string) {
	await sleep(100);

	if (stdout.columns < 80) {
		log(`${' '.repeat(5)} ${color.cyan(`◼`)}  ${color.cyan(prefix)}`);
		log(`${' '.repeat(9)}${color.dim(text)}`);
	}
	else {
		log(
			`${' '.repeat(5)} ${color.cyan(`◼`)}  ${color.cyan(
				prefix,
			)} ${color.dim(text)}`,
		);
	}
}

export async function error(prefix: string, text: string) {
	if (stdout.columns < 80) {
		log(`${' '.repeat(5)} ${color.red('▲')}  ${color.red(prefix)}`);
		log(`${' '.repeat(9)}${color.dim(text)}`);
	}
	else {
		log(
			`${' '.repeat(5)} ${color.red('▲')}  ${color.red(
				prefix,
			)} ${color.dim(text)}`,
		);
	}
}

export async function typescript() {
	await info(`no worries!`, `typescript is supported by default,`);
	log(
		`${' '.repeat(9)}${color.dim(
			'but you are free to continue writing JavaScript instead.',
		)}`,
	);
	await sleep(1000);
}

export async function nextSteps({
	projectDir,
	devCmd,
}: {
	projectDir: string
	devCmd: string
}) {
	const max = stdout.columns;
	const prefix = max < 80 ? ' ' : ' '.repeat(9);
	await sleep(200);

	log(
		`\n ${color.bgCyan(` ${color.black('next')} `)}  ${color.bold(
			'your project has been created!',
		)}`,
	);

	await sleep(100);

	if (projectDir !== '') {
		projectDir = projectDir.includes(' ')
			? `"./${projectDir}"`
			: `./${projectDir}`;

		const enter = [
			`\n${prefix}enter your project dir using`,
			color.cyan(`cd ${projectDir}`, ''),
		];
		const length = enter[0].length + stripAnsi(enter[1]).length;

		log(enter.join(length > max ? `\n${prefix}` : ' '));
	}

	log(`${prefix}run ${color.cyan(devCmd)} to start!`);

	await sleep(200);
}

export function printHelp({
	commandName,
	headline,
	usage,
	tables,
	description,
}: {
	commandName: string
	headline?: string
	usage?: string
	tables?: Record<string, [command: string, help: string][]>
	description?: string
}) {
	const linebreak = () => '';
	const calculatePadding = (rows: [string, string][]) =>
		rows.reduce((val, [first]) => Math.max(val, first.length), 0);

	const table = (
		rows: [string, string][],
		{ padding }: { padding: number },
	) => {
		const split = stdout.columns < 60;
		let rawText = '';

		for (const row of rows) {
			if (split)
				rawText += `   ${row[0]}\n   `;
			else rawText += `${`${row[0]}`.padStart(padding)}`;
			rawText += `  ${color.dim(row[1])}\n`;
		}

		return rawText.slice(0, -1);
	};

	const message = [];

	if (headline) {
		message.push(
			linebreak(),
			`${title(commandName)} ${color.green(
				`v${process.env.PACKAGE_VERSION ?? ''}`,
			)} ${headline}`,
		);
	}
	if (usage) {
		message.push(
			linebreak(),
			`${color.green(commandName)} ${color.bold(usage)}`,
		);
	}

	if (tables) {
		const tableEntries = Object.entries(tables);
		const padding = Math.max(
			...tableEntries.map(([, rows]) => calculatePadding(rows)),
		);
		for (const [, tableRows] of tableEntries)
			message.push(linebreak(), table(tableRows, { padding }));
	}

	if (description)
		message.push(linebreak(), `${description}`);

	log(`${message.join('\n')}\n`);
}
