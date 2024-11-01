import process from 'node:process';
import { defineConfig } from 'bumpp';

export default defineConfig({
	all: false,
	commit: true,
	confirm: true,
	cwd: process.cwd(),
	ignoreScripts: false,
	interface: true,
	noGitCheck: true,
	noVerify: false,
	preid: 'beta',
	push: true,
	recursive: true,
	release: 'prompt',
	sign: true,
	tag: true,
});
