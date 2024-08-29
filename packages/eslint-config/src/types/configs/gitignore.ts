export interface OptionsGitignore {
	/**
	 * Path to `.gitignore` files, or files with compatible formats like `.eslintignore`.
	 *
	 * @default [`.gitignore`] // or findUpSync('.gitignore')
	 */
	files?: string[];

	/**
	 * Throws an error if gitignore file isn't found.
	 *
	 * @default true
	 */
	strict?: boolean;

	/**
	 * Mark the current working directory as the root directory,
	 * disable searching for `.gitignore` files in parent directories.
	 *
	 * This option is not effective when `files` is explicitly specified.
	 *
	 * @default false
	 */
	root?: boolean;

	/**
	 * Current working directory, used to resolve relative paths.
	 *
	 * @default process.cwd()
	 */
	cwd?: string;
}
