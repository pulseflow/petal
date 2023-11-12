import { TestTaskDesc } from '../types.js';
import { JEST_CONFIG } from '../paths.js';
import { run } from 'jest-cli';

export const testTask = async (task: TestTaskDesc) => {
	const config = task.config || JEST_CONFIG;
	const args = [...(config ? ['--config', config] : []), ...task.restOptions];

	if (!process.env.NODE_ENV) (process.env as any).NODE_ENV = 'test';
	if (!process.env.TZ) (process.env as any).TZ = 'UTC';
	if (args.includes('--help'))
		(process.stdout as any)._handle.setBlocking(true);

	return run(args);
};
