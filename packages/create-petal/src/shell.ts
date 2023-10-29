// This is an extremely simplified version of [`execa`](https://github.com/sindresorhus/execa)
// intended to keep our dependency size down
import type { ChildProcess, StdioOptions } from 'node:child_process';
import type { Readable } from 'node:stream';

import { spawn } from 'node:child_process';
import { text as textFromStream } from 'node:stream/consumers';

export interface ExecaOptions {
	cwd?: string | URL;
	stdio?: StdioOptions;
	timeout?: number;
}

export interface Output {
	stdout: string;
	stderr: string;
	exitCode: number;
}

const text = (stream: NodeJS.ReadableStream | Readable | null) =>
	stream ? textFromStream(stream).then(t => t.trimEnd()) : '';

export const shell = async (
	command: string,
	flags: string[],
	opts: ExecaOptions = {},
): Promise<Output> => {
	let child: ChildProcess;
	let stdout = '';
	let stderr = '';

	try {
		child = spawn(command, flags, {
			cwd: opts.cwd,
			shell: true,
			stdio: opts.stdio,
			timeout: opts.timeout,
		});

		const done = new Promise(resolve => child.on('close', resolve));

		[stdout, stderr] = await Promise.all([
			text(child.stdout),
			text(child.stderr),
		]);

		await done;
	} catch (err) {
		throw { stdout, stderr, exitCode: 1 };
	}

	const { exitCode } = child;
	if (exitCode === null) throw new Error('timeout');
	if (exitCode !== 0) throw new Error(stderr);
	return { stdout, stderr, exitCode };
};
