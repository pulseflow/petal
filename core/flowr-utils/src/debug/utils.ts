/* eslint-disable no-console */
import { get } from 'node:https';
import { exec } from 'node:child_process';
import { platform } from 'node:os';
import process from 'node:process';

import color from 'chalk';
import { strip } from './prompt/index.js';

let petalVersion: string;

const unicode = { enabled: platform() !== 'win32' };
export const forceUnicode = () => unicode.enabled = true;
export const useAscii = () => !unicode.enabled;

export const sleep = (ms: number) => new Promise(f => setTimeout(f, ms));
export const randomBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
export const random = (...arr: any[]) => arr.flat(1)[Math.floor(arr.flat(1).length * Math.random())];

export function hookExit() {
	const onExit = (code: number) => {
		if (code === 0)
			console.log(`\n ${color.bgCyan(color.black(` done `))}  ${color.bold('operation cancelled.')}`);
	};

	process.on('beforeExit', onExit);
	return () => process.off('beforeExit', onExit);
}

export function getPetalVersion() {
	return new Promise<string>((f) => {
		if (petalVersion)
			return f(petalVersion);
		get('https://registry.npmjs.org/@flowr/petal/latest', (res) => {
			let body = '';
			res.on('data', chunk => body += chunk);
			res.on('end', () => {
				const { version } = JSON.parse(body);
				petalVersion = version;
				f(version);
			});
		});
	});
}

export function getUserName() {
	return new Promise<string>((f) => {
		exec('git config user.name', { encoding: 'utf-8' }, (_e, stdout, _stderr) => {
			if (stdout.trim())
				return f(stdout.split(' ')[0].trim());
			exec('whoami', { encoding: 'utf-8' }, (_e, stdout, _stderr) => {
				if (stdout.trim())
					return f(stdout.split(' ')[0].trim());

				return f('botanist');
			});
		});
	});
}

export function align(text: string, dir: 'start' | 'end' | 'center', len: number) {
	const pad = Math.max(len - strip(text).length, 0);
	switch (dir) {
		case 'start': return text + ' '.repeat(pad);
		case 'end': return ' '.repeat(pad) + text;
		case 'center': return ' '.repeat(Math.floor(pad / 2)) + text + ' '.repeat(Math.floor(pad / 2));
		default: return text;
	}
}
