import readline from 'node:readline';
import chalk from 'chalk';
import { createLogUpdate } from 'log-update';
import { cursor, erase } from 'sisteransi';
import { sleep } from './utils.js';

const COLORS = [
	'#883AE3',
	'#7B30E7',
	'#6B22EF',
	'#5711F8',
	'#3640FC',
	'#2387F1',
	'#3DA9A3',
	'#47DA93',
].reverse();

const FULL_FRAMES = [
	...Array.from({ length: COLORS.length - 1 }, () => COLORS[0]),
	...COLORS,
	...Array.from({ length: COLORS.length - 1 }, () => COLORS[COLORS.length - 1]),
	...[...COLORS].reverse(),
];

const GRADIENT = [...FULL_FRAMES.map((_, i) => frame(i))].reverse();

function frame(offset = 0) {
	const frames = FULL_FRAMES.slice(offset, offset + (COLORS.length - 2));

	if (frames.length < COLORS.length - 2) {
		const filled = Array.from<string>({ length: COLORS.length - frames.length - 2 }).fill(COLORS[0]);
		frames.push(...filled);
	}

	return frames;
}

const getGradientAnimFrames = () => GRADIENT.map(colors => ` ${colors.map(g => chalk.hex(g)('█')).join('')}`);
