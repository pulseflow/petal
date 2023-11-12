import readline from 'node:readline';
import { color } from '@astrojs/cli-kit';
import { createLogUpdate } from 'log-update';
import { random, randomBetween, sleep, useAscii } from '@astrojs/cli-kit/utils';
import { action, strip } from './action.js';

type Message = string | Promise<string>;

export const say = async (
	msg: Message | Message[],
	{
		clear = false,
		hat = '',
		stdin = process.stdin,
		stdout = process.stdout,
	} = {},
) => {
	const messages = Array.isArray(msg) ? msg : [msg];
	const rl = readline.createInterface({
		input: stdin,
		escapeCodeTimeout: 50,
	});
	const lu = createLogUpdate(stdout, { showCursor: false });

	readline.emitKeypressEvents(stdin, rl);

	let i = 0;
	let cancelled = false;
	const done = async () => {
		stdin.off('keypress', done);
		if (stdin.isTTY) stdin.setRawMode(false);
		rl.close();
		cancelled = true;
		if (i < messages.length - 1) lu.clear();
		else if (clear) lu.clear();
		else lu.done();
	};

	if (stdin.isTTY) stdin.setRawMode(true);
	stdin.on('keypress', (_str, key) => {
		if (stdin.isTTY) stdin.setRawMode(true);
		const _key = action(key, true);
		if (_key === 'abort') {
			done();
			return process.exit(0);
		}

		if (['up', 'down', 'left', 'right'].includes(_key as any)) return;

		done();
	});

	const eyes = useAscii()
		? ['•', '•', 'o', 'o', '•', 'O', '^', '•']
		: ['●', '●', '●', '●', '●', '○', '○', '•'];
	const mouths = useAscii()
		? ['•', 'O', '*', 'o', 'o', '•', '-']
		: ['•', '○', '■', '▪', '▫', '▬', '▭', '-', '○'];
	const walls = useAscii() ? ['—', '|'] : ['─', '│'];
	const corners = useAscii() ? ['+', '+', '+', '+'] : ['╭', '╮', '╰', '╯'];
	const defaultMouth = useAscii() ? 'u' : '◡';
	const defaultEye = useAscii() ? '^' : '◠';

	const face = (msg: string, { mouth = mouths[0], eye = eyes[0] } = {}) => {
		const [h, v] = walls;
		const [tl, tr, bl, br] = corners;
		const head = h.repeat(3 - strip(hat).split('').length);
		return [
			`${tl}${h.repeat(2)}${hat}${head}${tr}  ${color.bold(
				color.cyan('Flower:'),
			)}`,
			`${v} ${eye} ${color.cyanBright(mouth)} ${eye}  ${msg}`,
			`${bl}${h.repeat(5)}${br}`,
		].join('\n');
	};

	for (const message of messages) {
		const _msg = Array.isArray(await message)
			? await message
			: (await message).split(' ');

		let msg = [];
		let eye = random(eyes);
		let j = 0;

		for (const word of [''].concat(_msg)) {
			if (await word) msg.push(await word);
			const mouth = random(mouths);
			if (j % 7 === 0) eye = random(eyes);
			if (i == 1) eye = eye;
			lu('\n' + face(msg.join(' '), { mouth, eye }));
			if (!cancelled) await sleep(randomBetween(75, 200));
			j++;
		}

		if (!cancelled) await sleep(100);
		const tmp = await Promise.all(_msg).then(res => res.join(' '));
		const text = '\n' + face(tmp, { mouth: defaultMouth, eye: defaultEye });

		lu(text);
		if (!cancelled) await sleep(randomBetween(1200, 1400));
		i++;
	}

	stdin.off('keypress', done);
	await sleep(100);
	done();

	if (stdin.isTTY) stdin.setRawMode(false);
	stdin.removeAllListeners('keypress');
};
