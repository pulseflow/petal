import process from 'node:process';
import { getContext } from './actions/context.js';

import { dependencies } from './actions/deps.js';
import { git } from './actions/git.js';
import { help } from './actions/help.js';
import { intro } from './actions/intro.js';
import { next } from './actions/next-steps.js';
import { projectName } from './actions/project-name.js';
import { template } from './actions/template.js';
import { setupTypescript, typescript } from './actions/typescript.js';
import { verify } from './actions/verify.js';
import { setStdout } from './messages.js';

const exit = () => process.exit(0);
process.on('SIGINT', exit);
process.on('SIGTERM', exit);

export async function main() {
	// clear console bc pnpm startup is ugly
	// eslint-disable-next-line no-console
	console.clear();

	// npm init in v7.x+ doesn't require us to pass `--`
	const cleanArgv = process.argv.slice(2).filter(arg => arg !== '--');
	const context = await getContext(cleanArgv);
	if (context.help) {
		help();
		return;
	}

	const steps = [
		verify,
		intro,
		projectName,
		template,
		dependencies,
		typescript,
		git,
		next,
	];

	for (const step of steps) await step(context);

	process.exit(0);
}

export {
	dependencies,
	getContext,
	git,
	intro,
	next,
	projectName,
	setStdout,
	setupTypescript,
	template,
	typescript,
	verify,
};
