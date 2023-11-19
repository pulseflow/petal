declare module 'object.fromentries' {
	export default function fromEntries<T>(entries: Array<[string, T]>): {
		[s: string]: T
	};
}

declare module 'lint-staged' {
	export type Commands = string[] | string;
	export type ConfigFn = (filenames: string[]) => Commands | Promise<Commands>;
	export type Config = ConfigFn | { [key: string]: Commands | ConfigFn } | string;

	export default function lintStaged(options: {
		allowEmpty?: object
		concurrent?: boolean | number
		config?: Config
		cwd?: string
		debug?: boolean
		diff?: string
		diffFilter?: string
		maxArgLength?: number
		quiet?: boolean
		relative?: boolean
		shell?: boolean | string
		stash?: boolean
		verbose?: boolean
	}, logger?: Console): Promise<boolean>;
}

// / <reference types="node" />

declare module 'cross-spawn-promise' {
	import type { SpawnOptions } from 'node:child_process';

	interface CrossSpawnOptions extends SpawnOptions {
		encoding: string
	}

	interface CrossSpawnError {
		exitStatus: number
		message: string
		stack: string
		stderr: Uint8Array
		stdout: Uint8Array | null
	}

	export default function crossSpawnPromise(
		cmd: string,
		args?: any[],
		options?: Partial<CrossSpawnOptions>,
	): Promise<Uint8Array>;
}
