import { color, label, spinner as load } from '@astrojs/cli-kit';
import { align, sleep } from '@astrojs/cli-kit/utils';
import { exec } from 'node:child_process';
import stripAnsi from 'strip-ansi';
import { shell } from './shell.js';
import { say as flower } from './utils/say.js';

/**
 * Users may lack access to the global npm registry, so this function
 * checks the user's project type and will return an available registry.
 */
const getRegistry = async (packageManager: string): Promise<string> => {
	try {
		const { stdout } = await shell(packageManager, [
			'config',
			'get',
			'registry',
		]);
		return (
			stdout?.trim()?.replace(/\/$/, '') || 'https://registry.npmjs.org'
		);
	} catch (err) {
		return 'https://registry.npmjs.org';
	}
};

let stdout = process.stdout;
/** @internal Used to mock `process.stdout.write` for testing */
export const setStdout = (writable: typeof process.stdout) => {
	stdout = writable;
};

export const say = async (
	messages: string | string[],
	{ clear = false, hat = '' } = {},
) => flower(messages, { clear, hat, stdout });

export const spinner = async (args: {
	start: string;
	end: string;
	while: (...args: any) => Promise<any>;
}) => {
	await load(args, { stdout });
};

export const title = (text: string) => align(label(text), 'end', 7) + ' ';

export const welcome = [
	`hewo! get ready to plant some flowers or smth`,
	`henwo~ let's scare the inter webs`,
	`meow`,
];

export const getName = () =>
	new Promise<string>(resolve => {
		exec('git config user.name', { encoding: 'utf-8' }, (_1, gitName) => {
			if (gitName.trim()) return resolve(gitName.split(' ')[0].trim());
			exec('whoami', { encoding: 'utf-8' }, (_3, whoami) => {
				if (whoami.trim()) return resolve(whoami.split(' ')[0].trim());
				return resolve('planter');
			});
		});
	});

let v: string;
export const getVersion = (packageManager: string) =>
	new Promise<string>(async resolve => {
		if (v) return resolve(v);
		let registry = await getRegistry(packageManager);

		const { version } = await fetch(`${registry}/@flowr/petal/latest`, {
			redirect: 'follow',
		}).then(
			res => res.json(),
			() => ({ version: '' }),
		);

		v = version;
		resolve(version);
	});

export const log = (message: string) => stdout.write(message + '\n');

export const banner = () =>
	log(
		`${label(`petal`, color.bgMagenta, color.black)}  ${color.bold(
			`initializing...`,
		)}`,
	);

export const bannerAbort = () =>
	log(
		`\n${label(`petal`, color.bgRed, color.black)} ${color.bold(
			'aborting...',
		)}`,
	);

export const info = async (prefix: string, text: string) => {
	await sleep(100);

	if (stdout.columns < 80) {
		log(`${' '.repeat(5)} ${color.cyan(`◼`)}  ${color.cyan(prefix)}`);
		log(`${' '.repeat(9)}${color.dim(text)}`);
	} else {
		log(
			`${' '.repeat(5)} ${color.cyan(`◼`)}  ${color.cyan(
				prefix,
			)} ${color.dim(text)}`,
		);
	}
};

export const error = async (prefix: string, text: string) => {
	if (stdout.columns < 80) {
		log(`${' '.repeat(5)} ${color.red('▲')}  ${color.red(prefix)}`);
		log(`${' '.repeat(9)}${color.dim(text)}`);
	} else {
		log(
			`${' '.repeat(5)} ${color.red('▲')}  ${color.red(
				prefix,
			)} ${color.dim(text)}`,
		);
	}
};

export const typescript = async () => {
	await info(`no worries!`, `typescript is supported by default,`);
	log(
		`${' '.repeat(9)}${color.dim(
			'but you are free to continue writing JavaScript instead.',
		)}`,
	);
	await sleep(1000);
};

export const nextSteps = async ({
	projectDir,
	devCmd,
}: {
	projectDir: string;
	devCmd: string;
}) => {
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

		log(enter.join(length > max ? '\n' + prefix : ' '));
	}

	log(`${prefix}run ${color.cyan(devCmd)} to start!`);

	await sleep(200);
};

export const printHelp = ({
	commandName,
	headline,
	usage,
	tables,
	description,
}: {
	commandName: string;
	headline?: string;
	usage?: string;
	tables?: Record<string, [command: string, help: string][]>;
	description?: string;
}) => {
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
			if (split) rawText += `   ${row[0]}\n   `;
			else rawText += `${`${row[0]}`.padStart(padding)}`;
			rawText += '  ' + color.dim(row[1]) + '\n';
		}

		return rawText.slice(0, -1);
	};

	let message = [];

	if (headline)
		message.push(
			linebreak(),
			`${title(commandName)} ${color.green(
				`v${process.env.PACKAGE_VERSION ?? ''}`,
			)} ${headline}`,
		);
	if (usage)
		message.push(
			linebreak(),
			`${color.green(commandName)} ${color.bold(usage)}`,
		);

	if (tables) {
		const tableEntries = Object.entries(tables);
		const padding = Math.max(
			...tableEntries.map(([, rows]) => calculatePadding(rows)),
		);
		for (const [, tableRows] of tableEntries)
			message.push(linebreak(), table(tableRows, { padding }));
	}

	if (description) message.push(linebreak(), `${description}`);

	log(message.join('\n') + '\n');
};
