import { prompt } from '@astrojs/cli-kit';
import { random } from '@astrojs/cli-kit/utils';
import arg from 'arg';
import os from 'node:os';

import { getName, getVersion } from '../messages.js';

export interface Context {
	help: boolean;
	prompt: typeof prompt;
	cwd: string;
	packageManager: string;
	username: Promise<string>;
	version: Promise<string>;
	skipFlower: boolean;
	fancy?: boolean;
	dryRun?: boolean;
	yes?: boolean;
	projectName?: string;
	template?: string;
	ref: string;
	install?: boolean;
	git?: boolean;
	typescript?: string;
	stdin?: typeof process.stdin;
	stdout?: typeof process.stdout;
	exit(code: number): never;
	hat?: string;
}

export const getContext = async (argv: string[]): Promise<Context> => {
	const packageManager = detectPackageManager() ?? 'npm';

	const flags = arg(
		{
			'--template': String,
			'--ref': String,
			'--yes': Boolean,
			'--no': Boolean,
			'--install': Boolean,
			'--no-install': Boolean,
			'--git': Boolean,
			'--no-git': Boolean,
			'--typescript': String,
			'--skip-flower': Boolean,
			'--dry-run': Boolean,
			'--help': Boolean,
			'--fancy': Boolean,

			'-y': '--yes',
			'-n': '--no',
			'-h': '--help',
		},
		{ argv, permissive: true },
	);

	let cwd = flags['_'][0];
	let {
		'--help': help = false,
		'--template': template,
		'--no': no,
		'--yes': yes,
		'--install': install,
		'--no-install': noInstall,
		'--git': git,
		'--no-git': noGit,
		'--typescript': typescript,
		'--fancy': fancy,
		'--skip-flower': skipFlower,
		'--dry-run': dryRun,
		'--ref': ref,
	} = flags;
	let projectName = cwd;

	if (no) {
		yes = false;
		if (install == undefined) install = false;
		if (git == undefined) git = false;
		if (typescript == undefined) typescript = 'strict';
	}

	skipFlower =
		((os.platform() === 'win32' && !fancy) || skipFlower) ??
		[yes, no, install, git, typescript].some(v => v !== undefined);

	return {
		help,
		prompt,
		packageManager,
		username: getName(),
		version: getVersion(packageManager),
		skipFlower,
		fancy,
		dryRun,
		projectName,
		template,
		ref: ref ?? 'latest',
		hat: random(['🎃', '👻', '🕯️']),
		yes,
		install: install ?? (noInstall ? false : undefined),
		git: git ?? (noGit ? false : undefined),
		typescript,
		cwd,
		exit: code => process.exit(code),
	} satisfies Context;
};

const detectPackageManager = () => {
	if (!process.env.npm_config_user_agent) return;
	const specifier = process.env.npm_config_user_agent.split(' ')[0];
	const name = specifier.substring(0, specifier.lastIndexOf('/'));
	return name === 'npminstall' ? 'cnpm' : name;
};
