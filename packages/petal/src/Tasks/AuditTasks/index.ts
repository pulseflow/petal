import { default as spawn } from 'cross-spawn-promise';
import { default as Debug } from 'debug';

import { AuditTaskDesc } from '../../SharedTypes';
import { CONSUMING_ROOT } from '../../Paths';

const dbg = Debug('petal:audit'); // eslint-disable-line new-cap

enum ThresholdLimits {
	info = 1,
	low = 2,
	moderate = 4,
	high = 8,
	critical = 16,
	none = 32,
}

export async function auditTask(task: AuditTaskDesc): Promise<string[]> {
	const fns = [yarnRun];

	return await Promise.all(
		fns.map(async fn => {
			dbg('Beginning %s task', fn.name);
			const stdout = await fn(task);
			dbg('Finished %s task', fn.name);
			return stdout;
		}),
	);
}

/**
 * This task will run yarn audit at the location from which it was called.
 * Yarn audit returns a status code which is the sum of the following masks:
 * 1 for INFO
 * 2 for LOW
 * 4 for MODERATE
 * 8 for HIGH
 * 16 for CRITICAL
 *
 * The threshold ceiling is therefore 31. The default value of the threshold
 * is 32, returning 0 exit status unless a threshold option is set.
 * @see https://yarnpkg.com/lang/en/docs/cli/audit/
 */
async function yarnRun(task: AuditTaskDesc): Promise<string> {
	const cmd = 'pnpm';
	const { threshold } = task;

	const args = ['audit', '-C', CONSUMING_ROOT, ...task.restOptions];
	dbg('pnpm args %o', args);

	try {
		await spawn(cmd, args, { stdio: 'inherit' });
	} catch (err) {
		const thresholdReached =
			(err as any).exitStatus >= ThresholdLimits[threshold];
		if (thresholdReached) process.exit((err as any).exitStatus);
	}

	return '';
}
