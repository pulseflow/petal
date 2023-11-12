import path from 'node:path';
import type { Context } from './context.js';

import { nextSteps, say } from '../messages.js';

type NextContext = Pick<
	Context,
	'hat' | 'cwd' | 'packageManager' | 'skipFlower'
>;

export const next = async (ctx: NextContext) => {
	let projectDir = path.relative(process.cwd(), ctx.cwd);

	const commandMap: { [key: string]: string } = {
		npm: 'npm run dev',
		bun: 'bun run dev',
		yarn: 'yarn dev',
		pnpm: 'pnpm dev',
	};

	const devCmd =
		commandMap[ctx.packageManager as keyof typeof commandMap] ||
		'npm run dev';
	await nextSteps({ projectDir, devCmd });

	if (!ctx.skipFlower) {
		await say(['good luck out there!'], { hat: ctx.hat });
	}

	return;
};
