import { color, label } from '@astrojs/cli-kit';
import { random } from '@astrojs/cli-kit/utils';
import { banner, say, welcome } from '../messages.js';
import type { Context } from './context.js';

type IntroContext = Pick<
	Context,
	'hat' | 'skipFlower' | 'version' | 'username' | 'fancy'
>;

export async function intro(ctx: IntroContext) {
	banner();

	if (!ctx.skipFlower) {
		await say(
			[
				[
					'welcome',
					'to',
					label('petal', color.bgMagenta, color.black),
					Promise.resolve(ctx.version).then(version => `${version ? color.green(`v${version}`) : ''} `),
					Promise.resolve(ctx.username).then(username => `${username}!`),
				],
				random(welcome),
			],
			{ clear: true, hat: ctx.hat },
		);
	}
}
