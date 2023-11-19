import type { Buffer } from 'node:buffer';
import { ForwardedError, assertError } from '../../errors/index.js';
import { execFile, paths } from '../index.js';

/**
 * Run a git command, trimming the output splitting it into lines.
 */
export async function runGit(...args: string[]) {
	try {
		const { stdout } = await execFile('git', args, {
			shell: true,
			cwd: paths.targetRoot,
		});
		return stdout.trim().split(/\r\n|\r|\n/);
	}
	catch (error) {
		assertError(error);
		if (error.stderr || typeof error.code === 'number') {
			const stderr = (error.stderr as undefined | Buffer)?.toString(
				'utf8',
			);
			const msg = stderr?.trim() ?? `with exit code ${error.code}`;
			throw new Error(`git ${args[0]} failed, ${msg}`);
		}
		throw new ForwardedError('Unknown execution error', error);
	}
}

/**
 * Utilities for working with git.
 *
 * @public
 */
export class GitUtils {
	/**
	 * Returns a sorted list of all files that have changed since the merge base
	 * of the provided `ref` and HEAD, as well as all files that are not tracked by git.
	 */
	static async listChangedFiles(ref: string) {
		if (!ref)
			throw new Error('ref is required');

		let diffRef = ref;
		try {
			const [base] = await runGit('merge-base', 'HEAD', ref);
			diffRef = base;
		}
		catch {
			// silently fall back to using the ref directly if merge base is not available
		}

		const tracked = await runGit('diff', '--name-only', diffRef);
		const untracked = await runGit(
			'ls-files',
			'--others',
			'--exclude-standard',
		);

		return Array.from(new Set([...tracked, ...untracked]));
	}

	/**
	 * Returns the contents of a file at a specific ref.
	 */
	static async readFileAtRef(path: string, ref: string) {
		let showRef = ref;
		try {
			const [base] = await runGit('merge-base', 'HEAD', ref);
			showRef = base;
		}
		catch {
			// silently fall back to using the ref directly if merge base is not available
		}

		const { stdout } = await execFile(
			'git',
			['show', `${showRef}:${path}`],
			{
				shell: true,
				cwd: paths.targetRoot,
				maxBuffer: 1024 * 1024 * 50,
			},
		);
		return stdout;
	}
}
